import { DownloadedWebtoonObject } from './../navigation/stacks/DownloadsStack';
import Webtoon, { Chapter } from "./Webtoon";
import { parse, HTMLElement } from 'node-html-parser';
import RNFS from 'react-native-fs';
import { defaultDetails, defaultImage, defaultTitle } from "./config";
import RNFetchBlob from "rn-fetch-blob";

export function delay(ms: number): Promise<void> {
	return new Promise<void>(resolve => {
		setTimeout(resolve, ms);
	});
};


/**
 * Fetches the main webtoons by making an HTTP request to a specific URL.
 * @returns {Promise<string>} A promise that resolves to the fetched data as text.
 */
const fetchHtmlRes = async (url: string) => {
	const response = await fetch(url);
	const data = await response.text();
	return data;
}


/**
 * Loads the main webtoons by parsing the fetched data and extracting relevant information.
 * @returns {Promise<Webtoon[]>} A promise that resolves to an array of main webtoon objects.
 */
export async function loadMainWebtoons(): Promise<Webtoon[]> {
	const mainWebtoons: Webtoon[] = [];

	const htmlRes = parse(await fetchHtmlRes('https://www.mangageko.com/jumbo/manga/')).removeWhitespace();

	const novelItems = htmlRes.querySelectorAll('li[class="swiper-slide novel-item"]');
	let names = novelItems.map((parent) => (parent.firstChild as HTMLElement).getAttribute('title') || defaultTitle);
	let apiUrls = novelItems.map((parent) => (parent.firstChild as HTMLElement).getAttribute('href') || '');
	let imageUrls = htmlRes.querySelectorAll('img[data-src]').slice(0, 24).map(element => element.getAttribute('data-src') || defaultImage)

	for (let i = 0; i < 24; i++) mainWebtoons.push(new Webtoon(names[i], imageUrls[i], apiUrls[i]));

	return mainWebtoons;
}

export async function updateWebtoonChapters(webtoon: Webtoon, parsedHtml: HTMLElement): Promise<void> {
	const chaptersElements = parsedHtml.querySelectorAll('strong[class="chapter-title"]');
	const chapterUrls = parsedHtml.querySelectorAll('li[data-chapterno]');
	const chapterDetails = [];

	for (let i = 0; i < chaptersElements.length; i++) {
		chapterDetails.push({
			name: chaptersElements[i].innerText.trim(),
			released: chaptersElements[i].nextElementSibling.innerText,
			url: (chapterUrls[i].firstChild as HTMLElement).getAttribute("href") || '',
		})
	}

	webtoon.chapters = [...chapterDetails];
}

export async function fetchWebtoonDetails(webtoon: Webtoon): Promise<void> {

	const htmlDetails = await fetchHtmlRes('https://www.mangageko.com' + webtoon.apiUrl);
	const parsedDetails = parse(htmlDetails).removeWhitespace();

	const stats = parsedDetails.querySelector('div[class="header-stats"]');
	if (stats == null) { webtoon.details = defaultDetails; return; };

	const statNodes = stats.childNodes;
	let lastChapter = (statNodes[0] as HTMLElement).firstChild.innerText.split(' ')[1].split('-')[0];

	if (lastChapter[0] == '0' && lastChapter.length > 1) lastChapter = lastChapter.slice(1);

	let views = (statNodes[1] as HTMLElement).firstChild.innerText.split(' ').slice(1).join(' ');
	let bookmarks = (statNodes[2] as HTMLElement).firstChild.innerText.split(' ').slice(1).join(' ');
	let status = (statNodes[3] as HTMLElement).firstChild.innerText;
	let summaryNodes = parsedDetails.querySelector('p[class="description"]');
	let summary = (summaryNodes ? summaryNodes.childNodes.slice(1).map(n => n.innerText) : [defaultDetails.summary]).join('\n').trim();

	if (summary == defaultDetails.summary) {
		const matchDesc = htmlDetails.match(/<p class="description">(.*?)<\/p>/s);
		if (matchDesc) summary = matchDesc[1].trim().split("\n").slice(1).join(' ').replaceAll("\r", '').replaceAll("<br>", "\n").trim();
	};

	webtoon.details = {
		lastChapter: lastChapter,
		views: views,
		bookmarks: bookmarks,
		status: status,
		summary: summary,
	}

	updateWebtoonChapters(webtoon, parsedDetails);
}

export async function fetchAllChapters(webtoon: Webtoon) {
	const htmlDetails = await fetchHtmlRes('https://www.mangageko.com' + webtoon.apiUrl + 'all-chapters/');
	const parsedDetails = parse(htmlDetails).removeWhitespace();
	updateWebtoonChapters(webtoon, parsedDetails);
}

export async function fetchChapterImageUrls(chapter: Chapter): Promise<any[]> {

	if (chapter.url == '') return [];

	if (chapter.released == '') {
		const dirPath = chapter.url+'images/';
		const chapterImages = (await RNFS.readDir(dirPath))
			.map(f => ({
				uri: `file://${dirPath+f.name}`,
				index: parseInt(f.name.replace('index_', '').split('.')[0])
			}))
			.sort((a, b) => a.index - b.index)
			.map(f => f.uri);
		return chapterImages;
	};

	const htmlRes = await fetchHtmlRes("https://www.mangageko.com" + chapter.url);
	const data = parse(htmlRes).removeWhitespace();

	const imageUrls = data.querySelectorAll('img[onerror]').map(imgElement => imgElement.getAttribute("src"));

	return imageUrls ? imageUrls : [];
};

export function isObjectEmpty(obj: { [key: string]: any }): boolean {
	return Object.keys(obj).length === 0;
};

export function sanitizeFileName(fileName: string): string {

	const invalidCharactersPattern = /[\/\\:*?"<>|]/g;
	const sanitizedFileName = fileName.replace(invalidCharactersPattern, '');

	return sanitizedFileName;
};

export async function deleteFolderRecursive(path: string) {
	if (await RNFS.exists(path)) {
		const files = await RNFS.readDir(path);

		for (const file of files) {
			if (file.isDirectory()) {
				await deleteFolderRecursive(file.path);
			} else {
				await RNFS.unlink(file.path);
			}
		}

		await RNFS.unlink(path);
	}
};


export async function downloadImage(url: string, filePath: string): Promise<boolean> {
	try {
		const response = await RNFetchBlob.fetch('GET', url);
		
		if (response.respInfo.status === 200) {
			const base64data = response.base64();
			await RNFS.writeFile(filePath, base64data, 'base64');
			return true;
		} else {
			console.log('Failed to fetch the image:', response.respInfo.status);
			return false;
		};
	} catch (err) {
		console.log("Error downloading an image: ", err);
		return false;
	};
};


export async function fetchDownloadedChapters(webtoon: DownloadedWebtoonObject): Promise<Chapter[]> {
	const chaptersPath = `${RNFS.DocumentDirectoryPath}/downloads/${webtoon.formattedName}/chapters/`;
	let filteredChapters: Chapter[] = [];
	if (await RNFS.exists(chaptersPath)) {

		const chaptersPromises = (await RNFS.readDir(chaptersPath)).map(async (f) => {
			const filePath = `${chaptersPath}${sanitizeFileName(f.name)}/name`;
			if (await RNFS.exists(filePath)) {
				return {
					name: await RNFS.readFile(filePath),
					url: `${chaptersPath}${f.name}/`,
					released: '',
				} as Chapter;
			}
		});
	
		const chaptersResults = await Promise.all(chaptersPromises);
		filteredChapters = chaptersResults.filter((chapter): chapter is Chapter => chapter !== undefined);
	
		filteredChapters.sort((a, b) => {
			const indexA = parseInt(a.url.split('/').slice(-2)[0].split('_')[0], 10);
			const indexB = parseInt(b.url.split('/').slice(-2)[0].split('_')[0], 10);
			return indexB - indexA;
		});
	};
	return filteredChapters;
}