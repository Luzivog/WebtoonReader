import { Dimensions, StatusBar, View, TouchableOpacity, StyleSheet } from "react-native";
import { ChapterScreenNavigationProp, ChapterScreenRouteProp } from "../stacks/WebtoonStack";
import React, { useState, useEffect } from "react";
import WebView from 'react-native-webview';
import { fetchChapterImageUrls } from "../utils";
import LoadingScreen from "./LoadingScreen";
import ChapterScreenOverlay from "./components/ChapterOverlay";

const injectScript = `
document.body.addEventListener('click', function(e) {
    window.ReactNativeWebView.postMessage('You clicked inside WebView');
});
`;

export default function ChapterScreen({ navigation, route }: {
    navigation: ChapterScreenNavigationProp,
    route: ChapterScreenRouteProp
}) {    
    const { webtoon, chapter } = route.params;

    const [isLoading, setIsLoading] = useState(true);
    const [html, setHtml] = useState("");
    const [overlayVisible, setOverlayVisible] = useState(false);

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
        <View style={styles.container}>
            <StatusBar hidden={!overlayVisible}/>
            <WebView 
                injectedJavaScript={injectScript}
                onMessage={() => setOverlayVisible(!overlayVisible)}
                source={{html:html}}
                style={styles.webView}
                scalesPageToFit={true}
                bounces={false}
                scrollEnabled={true}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                onAccessibilityTap={() => console.log("hoi")}
            >
            </WebView>

            {overlayVisible && (
                <ChapterScreenOverlay navigation={navigation} webtoon={webtoon} chapter={chapter}/>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
    },
    webView: {
        width: Dimensions.get('window').width,
    },
    clickableArea: {
        position: 'absolute',
        width: "100%",
        height: "100%",
        backgroundColor: 'transparent',
    },
});
