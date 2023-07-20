import { Dimensions, StatusBar, View, StyleSheet, TouchableOpacity } from "react-native";
import { ChapterScreenNavigationProp, ChapterScreenRouteProp } from "../stacks/WebtoonStack";
import React, { useState, useEffect } from "react";
import WebView from 'react-native-webview';
import { fetchChapterImageUrls } from "../utils";
import LoadingScreen from "./LoadingScreen";
import ChapterScreenOverlay from "./components/ChapterOverlay";
import { ScrollView } from "react-native-gesture-handler";

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
    const [scrollViewHeight, setScrollViewHeight] = useState(0);


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
            <ScrollView 
                contentContainerStyle={{ height: scrollViewHeight }}
            >
                <WebView 
                    source={{html:html}}
                    style={styles.webView}
                    bounces={false}
                    scrollEnabled={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    injectedJavaScript={injectedJavaScript}
                    onMessage={({ nativeEvent: { data }}) => {
                        if (data && data.length > 0 && data[0] === "[") {
                            const parsedData = JSON.parse(data);
                            console.log(parsedData); 

                            let totalHeight = 0;
                            for (const img of parsedData) {
                                const scaleRatio = windowWidth / img.width
                                totalHeight += Math.ceil(img.height * scaleRatio); 
                                console.log(totalHeight)
                            }
                            setScrollViewHeight(Math.ceil(totalHeight));
                        } else if (data === "clicked") setOverlayVisible(!overlayVisible);
                    }}
                />

            </ScrollView>
    
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
        width: windowWidth,
        height: "100%",
    },
    clickableArea: {
        position: 'absolute',
        width: "100%",
        height: "100%",
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
