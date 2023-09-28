import { Dimensions, StatusBar, View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { ChapterScreenNavigationProp, ChapterScreenRouteProp } from "../navigation/stacks/WebtoonStack";
import React, { useState, useEffect } from "react";
import WebView from 'react-native-webview';
import { fetchChapterImageUrls } from "../utils/utils";
import LoadingScreen from "./LoadingScreen";
import ChapterScreenOverlay from "./components/ChapterOverlay";


const injectedJavaScript = `
(function() {
    let lastScrollPosition = 0;
    let velocity = 0;
    let minVelocity = 5; 

    setInterval(() => {
        const newScrollPosition = window.scrollY;
        velocity = Math.abs(newScrollPosition - lastScrollPosition);
        lastScrollPosition = newScrollPosition;
    }, 300);

    document.addEventListener("click", function() {
        window.ReactNativeWebView.postMessage(velocity);
        if (velocity < minVelocity) {
            window.ReactNativeWebView.postMessage("clicked");
        }
    });

    const images = document.getElementsByTagName('img');
    const dimensionsArray = [];
    let loadedImagesCount = 0;

    for(let img of images) {
        const dimensions = {
            width: img.naturalWidth,
            height: img.naturalHeight,
        };
        dimensionsArray.push(dimensions);

        loadedImagesCount += 1;
        if (loadedImagesCount === images.length) {
            window.ReactNativeWebView.postMessage(JSON.stringify(dimensionsArray));
        }
    }
})();
`


const windowWidth = Dimensions.get('window').width;

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
            for (let url of urls) localHtml+="<div style='width: 100%;'><img style='width: 100%; height: auto;' src='"+url+"'></div>";
            localHtml += "</body></html>";
    
            setHtml(localHtml);
            setIsLoading(false);
        })();
    }, [webtoon, chapter]);

    if (isLoading) return <LoadingScreen/>;

    const messageManager = ({ nativeEvent: { data } }: { nativeEvent: { data: string } }) => {
        if (data === "clicked") setOverlayVisible(!overlayVisible);
    }

    return (
        <View style={styles.container}>
            <StatusBar hidden={!overlayVisible}/>

            <WebView 
                source={{html:html}}
                style={styles.webView}
                bounces={false}
                scrollEnabled={true}
                onScroll={() => {if(overlayVisible) setOverlayVisible(false)}}
                injectedJavaScript={injectedJavaScript}
                onMessage={(nativeEvent) => messageManager(nativeEvent)}
            />

    
            {overlayVisible && (
                <ChapterScreenOverlay navigation={navigation} webtoon={webtoon} chapter={chapter}/>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    },
    webView: {
        width: windowWidth,
        flex: 1,
    },
    clickableArea: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
    },
    button: {
        width: 100,
        height: 30,
        backgroundColor: 'yellow',
        position: 'absolute', // position it absolutely...
        bottom: 0, // ...at the bottom
        alignSelf: 'center' // if you want to center it
    }
});
