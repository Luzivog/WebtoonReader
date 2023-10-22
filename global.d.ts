import { Chapter } from "./utils/Webtoon";

interface downloadingChapter {
    webtoonApiUrl: string,
    webtoonImageUrl: string,
    webtoonName: string,
    webtoonSummary: string,
    chapter: Chapter,
    chapterNumber: number,
    setPercentage: React.Dispatch<React.SetStateAction<number>>,
    setIsDownloaded: React.Dispatch<React.SetStateAction<boolean>>,
    setIsDownloading: React.Dispatch<React.SetStateAction<boolean>>,
    percentage: number
}

declare global {
    var downloadingChapters: {[key: string]: downloadingChapter};
    var downloadingQueue: string[];
}