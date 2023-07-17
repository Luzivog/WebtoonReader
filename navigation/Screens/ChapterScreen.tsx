import { Dimensions, StatusBar, View} from "react-native";
import { ChapterScreenNavigationProp, ChapterScreenRouteProp } from "../stacks/WebtoonStack";
import { useState, useEffect } from "react";
import WebView from 'react-native-webview';
import { fetchChapterImageUrls } from "../utils";
import LoadingScreen from "./LoadingScreen";


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

            let localHtml = `<html>`
            localHtml += "<body style='margin: 0 !important;padding: 0 !important;'>";
            for (let url of urls) localHtml+="<div style='width: 100%;'><img style='width: 100%; height: auto;' src='"+url+"'></div>"
            localHtml += "</body></html>";

            setHtml(localHtml);
            setIsLoading(false);
		})();
	}, [webtoon, chapter]);

    if (isLoading) return <LoadingScreen/>;

    return (
        <View style={{width: "100%", height: "100%"}}>
            <StatusBar hidden/>
            <WebView 
                source={{html:html}}
                style={{width: screenWidth}}
                scalesPageToFit={true}
                bounces={false}
                scrollEnabled={true}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}
