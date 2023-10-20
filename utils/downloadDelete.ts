import Webtoon from "./Webtoon";
import { downloadImage, sanitizeFileName, fetchChapterImageUrls, deleteFolderRecursive } from "./utils";
import RNFS from 'react-native-fs';
import { setDownloadingChapters } from "./actions";

let isProcessing = false; // Track if the queue is currently being processed

export async function processQueue() {
    if (isProcessing || global.downloadingChapters.length === 0) return; // Avoid parallel processing or processing an empty queue

    isProcessing = true; // Set processing flag

    try {
        while (global.downloadingChapters.length > 0) {
            console.log("Download queue length: ", global.downloadingChapters.length)

            const { webtoon, chapterIndex, setPercentage } = global.downloadingChapters[0];
            await handleDownload(webtoon, chapterIndex, setPercentage); // Process the dequeued item
            global.downloadingChapters.shift();
        }
    } finally {
        isProcessing = false; // Reset processing flag when queue is empty or an error occurred
    }
};

/**
 * handleDownload downloads specified chapter of a webtoon and saves details like 
 * cover image, name, and summary. Each chapter’s images are downloaded concurrently.
 * 
 * @param {Webtoon} webtoon - The Webtoon object containing details like apiUrl, imageUrl, name, details, and chapters.
 * @param {number} chapterIndex - An index specifying which chapter to download.
 * 
 * @returns {Promise<void>} Returns a promise which resolves when the specified chapters and it's details is downloaded.
 */
export const handleDownload = async (webtoon: Webtoon, chapterIndex: number, setPercentage: Function) => {

    //await deleteFolderRecursive(RNFS.DocumentDirectoryPath + '/downloads/');
    const webtoonName = sanitizeFileName(webtoon.apiUrl.slice(1, -1).split("/").join("-"));
    const dirPath = RNFS.DocumentDirectoryPath + '/downloads/' + webtoonName + "/";

    if (!await RNFS.exists(dirPath)) await RNFS.mkdir(dirPath);
    if (!(await RNFS.exists(dirPath + "cover"))) await downloadImage(webtoon.imageUrl, dirPath + "cover");
    if (!(await RNFS.exists(dirPath + "name"))) await RNFS.writeFile(dirPath + "name", webtoon.name);
    if (!(await RNFS.exists(dirPath + "summary"))) await RNFS.writeFile(dirPath + "summary", webtoon.details.summary);

    const chaptersPath = dirPath + "chapters/";
    if (!await RNFS.exists(chaptersPath)) await RNFS.mkdir(chaptersPath);

    const chapterName = sanitizeFileName(webtoon.chapters[chapterIndex].name);
    console.log(`Downloading chapter: ${chapterName}`);

    const chapNumber = webtoon.chapters.length - chapterIndex - 1

    const chapterPath = `${chaptersPath}${chapNumber}_${chapterName}/`;
    if (!await RNFS.exists(chapterPath)) await RNFS.mkdir(chapterPath);

    const imagesPath = `${chapterPath}images/`;
    if (!await RNFS.exists(imagesPath)) await RNFS.mkdir(imagesPath);

    const imagesUrls = await fetchChapterImageUrls(webtoon.chapters[chapterIndex]);

    const totalImages = imagesUrls.length;
    let downloadedImages = 0;

    const downloadImageAndUpdateProgress = async (imageUrl: string, filePath: string) => {
        await downloadImage(imageUrl, filePath);
        downloadedImages++;
        global.downloadingChapters[0].percentage = downloadedImages/totalImages;
        global.downloadingChapters[0].setPercentage(downloadedImages/totalImages);
    };

    const downloadPromises = imagesUrls.map(async (imageUrl, j) => {
        const imgName = `${j}_` + imageUrl.split("/").slice(-1)[0];
        await downloadImageAndUpdateProgress(imageUrl, `${imagesPath}${imgName}`);
    });

    await Promise.all(downloadPromises);

    await RNFS.writeFile(chapterPath + "name", webtoon.chapters[chapterIndex].name);

    global.downloadingChapters[0].setIsDownloaded(true);

    console.log(`Finished downloading chapter: ${webtoon.chapters[chapterIndex].name}`);
};
