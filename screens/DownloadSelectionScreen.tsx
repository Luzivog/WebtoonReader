import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Webtoon, { Chapter } from "../utils/Webtoon";
import { DownloadSelectionScreenNavigationProp, DownloadSelectionScreenRouteProp } from "../navigation/stacks/WebtoonStack";
import { DownloadedWebtoonObject } from "../navigation/stacks/DownloadsStack";
import ChapterList from "./components/ChapterList";
import { useEffect, useState } from "react";
import { isObjectEmpty, fetchWebtoonDetails, fetchAllChapters, delay, fetchDownloadedChapters } from "../utils/utils";
import { StatusBarHeight, vw } from "../utils/config";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ScrollView } from "react-native-gesture-handler";

export default function DonwloadSelectionScreen({ navigation, route }: {
    navigation: DownloadSelectionScreenNavigationProp,
    route: DownloadSelectionScreenRouteProp
}) {

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
            } else if (chapters.length === 0) setChapters(await fetchDownloadedChapters(webtoon));
        })();
    }, [chapters]);

    return (
        <ChapterList
            header={
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name='arrow-back' style={styles.arrowBack} size={40} />
                    </TouchableOpacity>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.titleContainer}>
                        <Text style={styles.title} numberOfLines={1}>
                            {webtoon.name}
                        </Text>
                    </ScrollView>
                </View>
            }
            chapters={currentChapters}
            onPress={() => { }}
        />
    );
}

const styles = StyleSheet.create({
    header: {
        padding: 2*vw,
        flexDirection: 'row',
        alignItems: 'center',
    },
    arrowBack: {
        color: 'tomato',
    },
    titleContainer: {
        marginHorizontal: 2 * vw,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    }
});