import Webtoon from "./Webtoon";
import { downloadImage, sanitizeFileName, fetchChapterImageUrls, deleteFolderRecursive } from "./utils";
import RNFS from 'react-native-fs';

export const handleDownload = async (webtoon: Webtoon, chapterIndexes: number[]) => {

    await deleteFolderRecursive(RNFS.DocumentDirectoryPath + '/downloads/');
    const webtoonName = webtoon.apiUrl.slice(1, -1).split("/").join("-");
    const dirPath = RNFS.DocumentDirectoryPath + '/downloads/' + webtoonName + "/";

    // Webtoon details
    if (!await RNFS.exists(dirPath)) await RNFS.mkdir(dirPath);
    if (!(await RNFS.exists(dirPath + "cover"))) await downloadImage(webtoon.imageUrl, dirPath + "cover");
    if (!(await RNFS.exists(dirPath + "name"))) await RNFS.writeFile(dirPath + "name", webtoon.name);
    if (!(await RNFS.exists(dirPath + "summary"))) await RNFS.writeFile(dirPath + "summary", webtoon.details.summary);

    const chaptersPath = dirPath + "chapters/";
    if (!await RNFS.exists(chaptersPath)) await RNFS.mkdir(chaptersPath);

    for (let y = 0; y < chapterIndexes.length; y++) {
        let i = chapterIndexes.length-1-chapterIndexes[y];
        const chapterName = sanitizeFileName(webtoon.chapters[i].name);
        console.log(`Downloading chapter: ${chapterName}`);
        
        const chapterPath = `${chaptersPath}${i}_${chapterName}/`;
        if (!await RNFS.exists(chapterPath)) await RNFS.mkdir(chapterPath);
        
        const imagesPath = `${chapterPath}images/`;
        if (!await RNFS.exists(imagesPath)) await RNFS.mkdir(imagesPath);
        
        const imagesUrls = await fetchChapterImageUrls(webtoon.chapters[i]);
        
        // Download images concurrently
        const downloadPromises = imagesUrls.map(async (imageUrl, j) => {
            const imgName = `${j}_`+imageUrl.split("/").slice(-1)[0];
            await downloadImage(imageUrl, `${imagesPath}${imgName}`);
        });

        // Wait for all download promises to resolve
        await Promise.all(downloadPromises);
        
        await RNFS.writeFile(chapterPath + "name", webtoon.chapters[i].name);
        
        console.log(`Finished downloading chapter: ${webtoon.chapters[i].name}`);
    };
};