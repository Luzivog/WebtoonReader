import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Webtoon, { Chapter } from "../utils/Webtoon";
import { DownloadSelectionScreenNavigationProp, DownloadSelectionScreenRouteProp } from "../navigation/stacks/WebtoonStack";
import { DownloadedWebtoonObject } from "../navigation/stacks/DownloadsStack";
import ChapterList from "./components/ChapterList";
import { useCallback, useEffect, useState } from "react";
import { isObjectEmpty, fetchWebtoonDetails, fetchAllChapters, fetchDownloadedChapters, sanitizeFileName } from "../utils/utils";
import { vw } from "../utils/config";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ScrollView } from "react-native-gesture-handler";
import React from "react";
import CircleLoader from "./components/CircleLoader";
import { processQueue } from "../utils/downloadDelete";
import RNFS from "react-native-fs";

const RenderItem = ({ webtoon, item }: {
    webtoon: Webtoon | DownloadedWebtoonObject,
    item: Chapter,
}): JSX.Element => {

    const id = webtoon.name + item.name;

    const [isDownloading, setIsDownloading] = useState<boolean>(
        "imageUrl" in webtoon && (global.downloadingChapters.find(dlEl => dlEl.id === id) != undefined)
    );

    const [isDownloaded, setIsDownloaded] = useState(!("imageUrl" in webtoon));

    const [percentage, setPercentage] = useState(() => {
        if (!("imageUrl" in webtoon)) return 0;
        let dlEl = global.downloadingChapters.find(dlEl => dlEl.id === id);
        if (dlEl === undefined) return 0;
        return dlEl.percentage;
    });

    if ("imageUrl" in webtoon){
        let element = global.downloadingChapters.find(dlEl => dlEl.id === id);
        if (element) {
            element.setPercentage = setPercentage;
            element.setIsDownloaded = setIsDownloaded;
        };
    };

    useEffect(() => {
        if ("imageUrl" in webtoon) {
            const index = webtoon.chapters.findIndex(c => c.name == item.name);
            const chapNumber = webtoon.chapters.length - index - 1;
            const webtoonName = sanitizeFileName(webtoon.apiUrl.slice(1, -1).split("/").join("-"));
            const chaptersPath = `${RNFS.DocumentDirectoryPath}/downloads/${sanitizeFileName(webtoonName)}/chapters/${chapNumber}_${sanitizeFileName(item.name)}/name`;
            (async () => {
                setIsDownloaded(await RNFS.exists(chaptersPath));
            })();
        }
    }, [isDownloaded]);


    const handlePress = useCallback(() => {
        if ("imageUrl" in webtoon) {
            const index = webtoon.chapters.findIndex(c => c.name == item.name);
            global.downloadingChapters.push({
                webtoon: webtoon,
                chapterIndex: index,
                id: id,
                setPercentage: setPercentage,
                setIsDownloaded: setIsDownloaded,
                percentage: 0
            });
            setIsDownloading(true);
            processQueue();
        };
    }, [webtoon, item]);

    return (
        <View style={styles.line}>
            <View key={item.name} style={styles.chapterItem}>
                <View style={styles.chapterItemContent}>
                    <Text
                        style={[
                            styles.chapterName,
                            item.released === '' ? styles.fullWidth : {}
                        ]}
                        numberOfLines={1}
                        ellipsizeMode='tail'
                    >
                        {item.name}
                    </Text>
                    {item.released !== '' && (
                        <Text style={styles.chapterReleased}>{item.released}</Text>
                    )}
                </View>
            </View>

            {
                    isDownloaded ? (
                        <TouchableOpacity
                                style={styles.iconContainer}
                            >
                            <Ionicons style={styles.downloadDeleteIcon} name="trash-outline" size={10 * vw} />
                        </TouchableOpacity>
                    ) : (
                        isDownloading ? (
                            <View style={styles.iconContainer}>
                                <CircleLoader size={28} percentage={percentage} />
                            </View>    
                        ) : (
                            <TouchableOpacity
                                style={styles.iconContainer}
                                onPress={handlePress}
                            >
                                <Ionicons style={styles.downloadDeleteIcon} name="download-outline" size={10 * vw} />
                            </TouchableOpacity>
                        )
                    )
                }
            </View>
    );
};

export default function DonwloadSelectionScreen({ navigation, route }: {
    navigation: DownloadSelectionScreenNavigationProp,
    route: DownloadSelectionScreenRouteProp
}) {

    const { webtoon, chapters }: { webtoon: Webtoon | DownloadedWebtoonObject, chapters: Chapter[] } = route.params;
    const [currentChapters, setChapters] = useState<Chapter[]>(chapters);
    const [downloadedChapters, setDownloadedChapters] = useState<string[]>([]);

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
    }, [currentChapters]);

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
            renderItem={({ item }) => <RenderItem webtoon={webtoon} item={item} />}
            onPress={() => { }}
        />
    );
}

const styles = StyleSheet.create({
    header: {
        padding: 2 * vw,
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
    },
    line: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 2 * vw,
        marginBottom: 10,
    },
    chapterItem: {
        height: 50,
        backgroundColor: '#353535',
        borderRadius: 5,
        paddingVertical: 15,
        paddingHorizontal: 10,
        width: '88%',
    },
    chapterItemContent: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    chapterName: {
        color: 'white',
        fontSize: 16,
        flex: 0.5,
    },
    chapterReleased: {
        color: 'white',
        fontSize: 14,
        textAlign: 'right',
        flex: 0.5,
    },
    fullWidth: { flex: 1 },
    iconContainer: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center'
    },
    downloadDeleteIcon: {
        color: "tomato",
        alignSelf: 'flex-end'
    },
});