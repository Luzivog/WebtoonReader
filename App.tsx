
import React from 'react';
import MainContainer from './navigation/MainContainer';
import { Dimensions, ScrollView } from 'react-native';
import WebView from 'react-native-webview';


const images = ["https://www.toonix.xyz/cdn_mangaraw/e-of-the-iron-bl/chapter-34/1.jpg", "https://www.toonix.xyz/cdn_mangaraw/e-of-the-iron-bl/chapter-34/2.jpg", "https://www.toonix.xyz/cdn_mangaraw/e-of-the-iron-bl/chapter-34/3.jpg", "https://www.toonix.xyz/cdn_mangaraw/e-of-the-iron-bl/chapter-34/4.jpg", "https://www.toonix.xyz/cdn_mangaraw/e-of-the-iron-bl/chapter-34/5.jpg", "https://www.toonix.xyz/cdn_mangaraw/e-of-the-iron-bl/chapter-34/6.jpg", "https://www.toonix.xyz/cdn_mangaraw/e-of-the-iron-bl/chapter-34/7.jpg", "https://www.toonix.xyz/cdn_mangaraw/e-of-the-iron-bl/chapter-34/8.jpg", "https://www.toonix.xyz/cdn_mangaraw/e-of-the-iron-bl/chapter-34/9.jpg", "https://www.toonix.xyz/cdn_mangaraw/e-of-the-iron-bl/chapter-34/10.jpg", "https://www.toonix.xyz/cdn_mangaraw/e-of-the-iron-bl/chapter-34/11.jpg", "https://www.toonix.xyz/cdn_mangaraw/e-of-the-iron-bl/chapter-34/12.jpg", "https://www.toonix.xyz/cdn_mangaraw/e-of-the-iron-bl/chapter-34/13.jpg", "https://www.toonix.xyz/cdn_mangaraw/e-of-the-iron-bl/chapter-34/14.jpg"]

let html = `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" /></head>`
html += "<body style='margin: 0 !important;padding: 0 !important;'>"
for (let im of images) html+="<img style='width: 100%' src='"+im+"'>"
html+="</body></html>"

export default function App(): JSX.Element {
	return (
		<MainContainer/>
	);
};
