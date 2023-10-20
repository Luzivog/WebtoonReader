declare module globalThis {
    var downloadingChapters: { 
        webtoon: Webtoon, 
        chapterIndex: number, 
        id: string,
        setPercentage: SetStateAction<number>,
        percentage: number
    }[];
}