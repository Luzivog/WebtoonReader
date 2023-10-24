import { downloadImage, sanitizeFileName, fetchChapterImageUrls, deleteFolderRecursive, delay } from "./utils";
import RNFS from 'react-native-fs';

let isProcessing = false;

/**
 * processQueue manages the queue of chapters to be downloaded. 
 * It ensures that downloads are processed sequentially, preventing multiple chapters 
 * from being downloaded simultaneously. The function continually checks the global 
 * downloadingQueue for pending downloads and initiates the download process for each 
 * pending item by calling the handleDownload function.
 * 
 * @returns {Promise<void>} Returns a promise which resolves when all items in the
 * downloadingQueue have been processed, or immediately if the queue is currently
 * being processed or is empty.
 */
export async function processQueue() {
    if (isProcessing || global.downloadingQueue.length === 0) return;

    isProcessing = true;

    try {
        while (global.downloadingQueue.length > 0) {
            const id = global.downloadingQueue[0];
            await handleDownload(id);
            global.downloadingQueue.shift();
            await delay(5000);
        }
    } finally {
        isProcessing = false;
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
export const handleDownload = async (id: string) => {

    let dl = global.downloadingChapters[id];
    if (dl === undefined) return;

    console.log("Started downloading:", global.downloadingChapters[id].chapter)

    //await deleteFolderRecursive(RNFS.DocumentDirectoryPath + '/downloads/');
    const webtoonName = sanitizeFileName(dl.webtoonApiUrl.slice(1, -1).split("/").join("-"));
    const dirPath = RNFS.DocumentDirectoryPath + '/downloads/' + webtoonName + "/";

    if (!await RNFS.exists(dirPath)) await RNFS.mkdir(dirPath);
    if (!(await RNFS.exists(dirPath + "cover"))) await downloadImage(dl.webtoonImageUrl, dirPath + "cover");
    if (!(await RNFS.exists(dirPath + "name"))) await RNFS.writeFile(dirPath + "name", dl.webtoonName);
    if (!(await RNFS.exists(dirPath + "summary"))) await RNFS.writeFile(dirPath + "summary", dl.webtoonSummary);

    const chaptersPath = dirPath + "chapters/";
    if (!await RNFS.exists(chaptersPath)) await RNFS.mkdir(chaptersPath);

    const chapterName = sanitizeFileName(dl.chapter.name);

    const chapterPath = `${chaptersPath}${dl.chapterNumber}_${chapterName}/`;
    if (!await RNFS.exists(chapterPath)) await RNFS.mkdir(chapterPath);

    const imagesPath = `${chapterPath}images/`;
    if (!await RNFS.exists(imagesPath)) await RNFS.mkdir(imagesPath);

    const imagesUrls = await fetchChapterImageUrls(dl.chapter);

    const totalImages = imagesUrls.length;
    let downloadedImages = 0;


    const downloadImageAndUpdateProgress = async (imageUrl: string, filePath: string) => {
        await downloadImage(imageUrl, filePath);
        downloadedImages++;
        dl.percentage = downloadedImages / totalImages;
        dl.setPercentage(downloadedImages / totalImages);
    };

    const downloadPromises = imagesUrls.map(async (imageUrl, j) => {
        const imgName = `${j}_` + imageUrl.split("/").slice(-1)[0];
        await downloadImageAndUpdateProgress(imageUrl, `${imagesPath}${imgName}`);
    });

    await Promise.all(downloadPromises);

    await RNFS.writeFile(chapterPath + "name", dl.chapter.name);

    console.log("Finished downloading:", global.downloadingChapters[id].chapter)

    delete global.downloadingChapters[id];
    dl.setIsDownloading(false);
    dl.setIsDownloaded(true);
};
