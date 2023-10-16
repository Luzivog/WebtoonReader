import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ChapterScreenNavigationProp } from "../../navigation/stacks/WebtoonStack";
import Webtoon, { Chapter } from "../../utils/Webtoon";
import { StatusBarHeight } from "../../utils/config";

export default function ChapterScreenOverlay({ navigation, chapters, chapter }: {
    navigation: ChapterScreenNavigationProp,
    chapters: Chapter[],
    chapter: { name: string, released: string, url: string }
}) {
    const chapterIndex = chapters.indexOf(chapter);

    const NavigationButton = ({ iconName, direction }: { iconName: string, direction: string }) => {
        const isButtonVisible = direction === 'next'
            ? chapterIndex > 0
            : chapterIndex != chapters.length - 1;

        const navigateTo = direction === 'next'
            ? chapters[chapterIndex - 1]
            : chapters[chapterIndex + 1];

        if (isButtonVisible) {
            return (
                <TouchableOpacity onPress={() => navigation.navigate("ChapterScreen", { chapters, chapter: navigateTo })}>
                    <Ionicons name={iconName} style={styles.icon} />
                </TouchableOpacity>
            );
        } else return (<View />);
    }

    const UtilityButton = ({ iconName, onPress }: { iconName: string, onPress: () => void }) => (
        <TouchableOpacity onPress={onPress}>
            <Ionicons name={iconName} style={[styles.icon, { fontSize: 30 }]} />
        </TouchableOpacity>
    );

    return (
        <View style={styles.overlay}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="list" style={styles.icon} />
                </TouchableOpacity>
                <Text numberOfLines={1} ellipsizeMode='tail' style={styles.chapterTitle}>{chapter.name}</Text>
            </View>
            <View style={styles.bottomBar}>
                <View style={styles.utilityButtons}>
                    <UtilityButton iconName="chatbubbles-outline" onPress={() => console.log("Comment")} />
                    <UtilityButton iconName="bookmark-outline" onPress={() => console.log("Bookmark")} />
                </View>
                <View style={styles.navigationButtons}>
                    <NavigationButton iconName="caret-back" direction="previous" />
                    <NavigationButton iconName="caret-forward" direction="next" />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'space-between',
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        height: StatusBarHeight + 50,
        backgroundColor: '#252525',
        paddingLeft: 15,
        paddingTop: StatusBarHeight,
    },
    chapterTitle: {
        marginLeft: 20,
        marginRight: 20,
        fontSize: 18,
        color: 'white',
        flex: 1,
    },
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        backgroundColor: '#252525',
        paddingLeft: 15,
        paddingRight: 15,
    },
    navigationButtons: {
        flexDirection: 'row',
    },
    utilityButtons: {
        flexDirection: 'row',
    },
    icon: {
        fontSize: 35,
        color: 'white',
        marginHorizontal: 10
    }
});
