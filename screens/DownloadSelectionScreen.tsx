import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Webtoon, { Chapter } from "../utils/Webtoon";
import { DownloadSelectionScreenNavigationProp, DownloadSelectionScreenRouteProp } from "../navigation/stacks/WebtoonStack";
import { DownloadedWebtoonObject } from "../navigation/stacks/DownloadsStack";
import ChapterList, { RenderItemProps, extraDataType } from "./components/ChapterList";
import { useEffect, useState } from "react";
import { isObjectEmpty, fetchWebtoonDetails, fetchAllChapters, delay, fetchDownloadedChapters } from "../utils/utils";
import { vh, vw } from "../utils/config";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ScrollView } from "react-native-gesture-handler";
import React from "react";
import CircleLoader from "./components/CircleLoader";


const RenderItem = ({ webtoonName, item, extraData, setDownloadingChapters, setDownloadedChapters }: {
    webtoonName: string,
    item: Chapter,
    extraData: extraDataType,
    setDownloadingChapters: Function,
    setDownloadedChapters: Function
}): JSX.Element => {

    const id = webtoonName+item.name;

    return (
        <View style={styles.line}>
            <View
                key={item.name}
                style={styles.chapterItem}
            >
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

            <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => {
                    const newDownloadingChapters = {
                        ...extraData.downloadingChapters,
                        [id]: 0,
                    };
                    setDownloadingChapters(newDownloadingChapters);
                }}
            >
                {id in extraData.downloadingChapters ?
                    <CircleLoader size={28} percentage={extraData.downloadingChapters[id]} />
                    : <Ionicons style={styles.downloadDeleteIcon} name="download-outline" size={10 * vw} />}
            </TouchableOpacity>
        </View>
    );
};

export default function DonwloadSelectionScreen({ navigation, route }: {
    navigation: DownloadSelectionScreenNavigationProp,
    route: DownloadSelectionScreenRouteProp
}) {

    const { webtoon, chapters }: { webtoon: Webtoon | DownloadedWebtoonObject, chapters: Chapter[] } = route.params;
    const [currentChapters, setChapters] = useState<Chapter[]>(chapters);
    const [downloadingChapters, setDownloadingChapters] = useState<{ [name: string]: number }>({});
    const [downloadedChapters, setDownloadedChapters] = useState<string[]>([]);

    let extraData = { downloadingChapters: downloadingChapters, downloadedChapters: downloadedChapters }

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
    }, [currentChapters, downloadingChapters]);

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
            renderItem={({ item }) => <RenderItem
                webtoonName={webtoon.name}
                item={item}
                extraData={extraData}
                setDownloadingChapters={setDownloadingChapters}
                setDownloadedChapters={setDownloadedChapters}    
            />}
            extraData={extraData}
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