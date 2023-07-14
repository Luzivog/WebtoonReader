import Webtoon from "./Webtoon";
import { parse, HTMLElement } from 'node-html-parser';
import { config } from "./config";

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
    let names = novelItems.map((parent) => (parent.firstChild as HTMLElement).getAttribute('title') || config.defaultTitle);
    let apiUrls = novelItems.map((parent) => (parent.firstChild as HTMLElement).getAttribute('href') || '');
    let imageUrls = htmlRes.querySelectorAll('img[data-src]').slice(0,24).map(element => element.getAttribute('data-src') || config.defaultImage)

	for (let i = 0; i<24; i++) mainWebtoons.push(new Webtoon(names[i], imageUrls[i], apiUrls[i]));

	return mainWebtoons;
}

export async function fetchWebtoonDetails(webtoon: Webtoon): Promise<void> {

	const [htmlDetails, htmlChapters] = await Promise.all([fetchHtmlRes('https://www.mangageko.com'+webtoon.apiUrl), fetchHtmlRes('https://www.mangageko.com'+webtoon.apiUrl+'all-chapters/')]);
	const [parsedDetails, parsedChapters] = [parse(htmlDetails).removeWhitespace(), parse(htmlChapters).removeWhitespace()];

	const stats = parsedDetails.querySelector('div[class="header-stats"]');
	if (stats == null) webtoon.details = config.defaultDetails;
	else {
		const statNodes = stats.childNodes;
		let lastChapter = (statNodes[0]  as HTMLElement).firstChild.innerText.split(' ')[1].split('-')[0];
		if (lastChapter[0] == '0' && lastChapter.length > 1) lastChapter = lastChapter.slice(1); 
		let views = (statNodes[1]  as HTMLElement).firstChild.innerText.split(' ').slice(1).join(' ');
		let bookmarks = (statNodes[2]  as HTMLElement).firstChild.innerText.split(' ').slice(1).join(' ');
		let status = (statNodes[3]  as HTMLElement).firstChild.innerText;
		let summaryNodes = parsedDetails.querySelector('p[class="description"]');
		let summary = (summaryNodes ? summaryNodes.childNodes.slice(1).map(n => n.innerText) : [config.defaultDetails.summary]).join('\n').trim();
		if (summary == config.defaultDetails.summary) {
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
	}

	const chaptersElements = parsedChapters.querySelectorAll('strong[class="chapter-title"]');
	const chapterUrls = parsedChapters.querySelectorAll('li[data-chapterno]');
    const chapterDetails = [];

	for (let i=0;i<chaptersElements.length;i++) {
		chapterDetails.push({
			name: chaptersElements[i].innerText.trim(),
			released: chaptersElements[i].nextElementSibling.innerText,
			url: (chapterUrls[i].firstChild as HTMLElement).getAttribute("href") || '',
		})
	}

	webtoon.chapters = chapterDetails;
}

export async function fetchChapterImageUrls(webtoon: Webtoon, chapter: {name: string, released: string, url: string}): Promise<any[]> {

	if (chapter.url == '') return [];

	const htmlRes = await fetchHtmlRes("https://www.mangageko.com"+chapter.url);
	const data = parse(htmlRes).removeWhitespace();

	const imageUrls = data.querySelectorAll('img[onerror]').map(imgElement => imgElement.getAttribute("src"));

	return imageUrls ? imageUrls : [];
}

export default function isObjectEmpty(obj: { [key: string]: any }): boolean {
	return Object.keys(obj).length === 0;
}