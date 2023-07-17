import { FlatList, Image, Dimensions, StatusBar, View, ScrollView} from "react-native";
import { ChapterScreenNavigationProp, ChapterScreenRouteProp } from "../stacks/WebtoonStack";
import { useState, useEffect } from "react";
import FastImage from 'react-native-fast-image';
import WebView from 'react-native-webview';
import { fetchChapterImageUrls } from "../utils";
import LoadingScreen from "./LoadingScreen";
import AutoHeightWebView from 'react-native-autoheight-webview'


const screenWidth = Dimensions.get('window').width;

export default function ChapterScreen({ navigation, route }: {
	navigation: ChapterScreenNavigationProp,
	route: ChapterScreenRouteProp
}) {
    const { webtoon, chapter } = route.params;

    const [isLoading, setIsLoading] = useState(true);
    const [html, setHtml] = useState("");

    useEffect(() => {
		(async () => {
            const urls = await fetchChapterImageUrls(webtoon, chapter);

            let localHtml = `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" /></head>`
            localHtml += "<body style='margin: 0 !important;padding: 0 !important;'>";
            for (let url of urls) localHtml+="<img style='width: 100%' src='"+url+"'>"
            localHtml += "</body></html>";

            setHtml(localHtml);
            setIsLoading(false);
		})();
	}, [webtoon, chapter]);

    if (isLoading) return <LoadingScreen/>;

    return (
        <View>
            <StatusBar hidden/>
            <ScrollView showsVerticalScrollIndicator={false}>
                <AutoHeightWebView
                    source={{html:html}}
                    style={{width: Dimensions.get('window').width}}
                />
            </ScrollView>
        </View>
    );
}