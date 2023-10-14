import { DarkTheme } from "@react-navigation/native"
import { Dimensions, StatusBar } from "react-native"

export const defaultTitle = "Error: Could not get title";

export const defaultImage = "https://images.novel-fast.club/avatar/157x211/media/manga_covers/default-placeholder.png";

export const defaultDetails = {
    lastChapter: "Error",
    views: "Error",
    bookmarks: "Error",
    status: "Error",
    summary: "Error: Couldn't fetch summary", 
};

export const CustomDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors, background: '#252525'},
};

export const StatusBarHeight = StatusBar.currentHeight ? StatusBar.currentHeight : 0;

export const vw = Dimensions.get('window').width / 100;

export const vh = Dimensions.get('window').height / 100;

export const navigationBarHeight = 60;