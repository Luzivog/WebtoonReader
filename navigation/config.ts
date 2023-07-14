import { DarkTheme } from "@react-navigation/native"

export const config = {
    defaultTitle: "Error: Could not get title",
    defaultImage: "https://images.novel-fast.club/avatar/157x211/media/manga_covers/default-placeholder.png",
    defaultDetails: {
        lastChapter: "Error",
		views: "Error",
		bookmarks: "Error",
		status: "Error",
        summary: "Error: Couldn't fetch summary", 
    },
    CustomDarkTheme: {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors, background: '#252525'},
    },
}