import { View, StyleSheet } from "react-native";
import Webtoon, { Chapter } from "../utils/Webtoon";
import { DownloadSelectionScreenNavigationProp, DownloadSelectionScreenRouteProp } from "../navigation/stacks/WebtoonStack";
import { DownloadedWebtoonObject } from "../navigation/stacks/DownloadsStack";
import ChapterList from "./components/ChapterList";
import { useEffect, useState } from "react";
import { isObjectEmpty, fetchWebtoonDetails, fetchAllChapters, delay } from "../utils/utils";

export default function DonwloadSelectionScreen({ navigation, route }: {
	navigation: DownloadSelectionScreenNavigationProp,
	route: DownloadSelectionScreenRouteProp
})  {

    const { webtoon, chapters }: { webtoon: Webtoon | DownloadedWebtoonObject, chapters: Chapter[] } = route.params;
    const [currentChapters, setChapters] = useState<Chapter[]>(chapters);

    useEffect(() => {
        (async () => {
            if ('imageUrl' in webtoon) {
                if (isObjectEmpty(webtoon.details)) await fetchWebtoonDetails(webtoon);
                else if (!webtoon.allChapters) {
                    await fetchAllChapters(webtoon);
                    webtoon.allChapters = true;
                };
                setChapters(webtoon.chapters);
            }
        })();
    }, [chapters]);

	return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
           <ChapterList header={<></>} chapters={currentChapters} onPress={()=>{}}></ChapterList>
        </View>
	);
}

const styles = StyleSheet.create({
	
});