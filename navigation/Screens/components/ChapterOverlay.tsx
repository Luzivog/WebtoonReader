import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ChapterScreenNavigationProp } from "../../stacks/WebtoonStack";
import { config } from "../../config";
import Webtoon from "../../Webtoon";

export default function ChapterScreenOverlay({ navigation, webtoon, chapter }: {
    navigation: ChapterScreenNavigationProp,
    webtoon: Webtoon,
    chapter: {name: string, released: string, url: string}
}) {
    const chapterIndex = webtoon.chapters.indexOf(chapter);

    const NavigationButton = ({ iconName, direction } : {iconName: string, direction: string}) => {
        const isButtonVisible = direction === 'next'
            ? chapterIndex != webtoon.chapters.length - 1
            : chapterIndex > 0;

        const navigateTo = direction === 'next'
            ? webtoon.chapters[chapterIndex + 1]
            : webtoon.chapters[chapterIndex - 1];

        if (isButtonVisible) {
            return (
                <TouchableOpacity onPress={() => navigation.navigate("ChapterScreen", { webtoon, chapter: navigateTo })}>
                    <Ionicons name={iconName} style={styles.icon}/>
                </TouchableOpacity>
            );
        } else return (<View/>);
    }

    return (
        <View style={styles.overlay}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="list" style={styles.icon} />
                </TouchableOpacity>
                <Text numberOfLines={1} ellipsizeMode='tail' style={styles.chapterTitle}>{chapter.name}</Text>
            </View>
            <View style={styles.bottomBar}>
                <NavigationButton iconName="caret-back" direction="next" />
                <NavigationButton iconName="caret-forward" direction="previous" />
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
        height: config.StatusBarHeight + 50,
        backgroundColor: '#252525',
        paddingLeft: 15,
        paddingTop: config.StatusBarHeight,
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
    icon: {
        fontSize: 35,
        color: 'white'
    }
});
