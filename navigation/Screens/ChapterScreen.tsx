import { Dimensions, StatusBar, View, StyleSheet } from "react-native";
import { ChapterScreenNavigationProp, ChapterScreenRouteProp } from "../stacks/WebtoonStack";
import React, { useState, useEffect } from "react";
import WebView from 'react-native-webview';
import { fetchChapterImageUrls } from "../utils";
import LoadingScreen from "./LoadingScreen";
import ChapterScreenOverlay from "./components/ChapterOverlay";
import { ScrollView } from "react-native-gesture-handler";

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
            localHtml += `<button onclick="console.log('hoi')">Click me</button>`
            localHtml += "</body></html>";
    
            setHtml(localHtml);
            setIsLoading(false);
        })();
    }, [webtoon, chapter]);
    

    if (isLoading) return <LoadingScreen/>;

    return (
        <View style={styles.container}>
            <StatusBar hidden={!overlayVisible}/>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} scrollEnabled={true}>
            <WebView 
                source={{html:html}}
                style={styles.webView}
                scalesPageToFit={true}
                bounces={false}
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                injectedJavaScript={`(function() {
                    let lastScrollPosition = 0;
                    let velocity = 0;
                    let minVelocity = 5; // Set minimum velocity for clicks to be allowed. You may need to adjust this value.
                    
                    window.onscroll = function() {
                        window.ReactNativeWebView.postMessage("scrolled");
                    };
                    setInterval(() => {
                        const newScrollPosition = window.scrollY;
                        velocity = Math.abs(newScrollPosition - lastScrollPosition);
                        lastScrollPosition = newScrollPosition;
                    }, 300); // Set time interval for checking velocity. You may need to adjust this value.
            
                    document.addEventListener("click", function() {
                        window.ReactNativeWebView.postMessage(velocity);
                        if (velocity < minVelocity) {
                            window.ReactNativeWebView.postMessage("clicked");
                        }
                    });
                })();`}
                onMessage={({ nativeEvent: { data }}) => {
                    console.log(data);
                    if (data === "clicked") setOverlayVisible(!overlayVisible);
                    if (data === "scrolled" && overlayVisible) setOverlayVisible(false);
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
        width: Dimensions.get('window').width,
        height: "100%",
    },
    clickableArea: {
        position: 'absolute',
        width: "100%",
        height: "100%",
        backgroundColor: 'transparent',
    },
});
