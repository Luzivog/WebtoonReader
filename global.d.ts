declare module globalThis {
    var downloadingChapters: { 
        webtoon: Webtoon, 
        chapterIndex: number, 
        id: string,
        setPercentage: SetStateAction<number>,
        setIsDownloaded: SetStateAction<boolean>,
        percentage: number
    }[];
}