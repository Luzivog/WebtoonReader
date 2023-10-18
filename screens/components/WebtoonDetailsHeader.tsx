import { View, TouchableOpacity, Text, Modal, StyleSheet } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import Webtoon, { Chapter } from "../../utils/Webtoon"
import DetailItem from "./DetailItem"
import InfoPopup from "./InfoPopup"
import AuthOverlay from './AuthOverlay';
import { WebtoonDetailsScreenNavigationProp } from '../../navigation/stacks/WebtoonStack';
import { vw } from '../../utils/config';
import { DownloadedWebtoonObject } from "../../navigation/stacks/DownloadsStack";
import FastImage from "react-native-fast-image";

const handleReadChapter = () => {
    // Add logic to handle reading chapter 1
};

const handleBookmark = (navigation: WebtoonDetailsScreenNavigationProp) => {
    navigation.navigate("RegisterScreen")
};

const handleDelete = (formattedName: string): void => {
}

const WebtoonDetailHeader = (

    navigation: WebtoonDetailsScreenNavigationProp,
    webtoon: Webtoon | DownloadedWebtoonObject,
    isPopupVisible: boolean,
    isAuthOverlayVisible: boolean,
    setPopupVisible: (visible: boolean) => void,
    toggleAuthOverlay: (visible: boolean) => void,
    chapters: Chapter[]

) => {

    console.log("Webtoon detail header:", chapters.length);

    const download = 'imageUrl' in webtoon;

    return (
        <View style={styles.container}>

            <View style={[styles.header, {marginBottom: download ? 8 : 0}]}>

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name='arrow-back' style={styles.arrowBack} size={40} />
                </TouchableOpacity>

                <View style={styles.iconContainer}>

                    <TouchableOpacity onPress={() => setPopupVisible(!isPopupVisible)}>
                        <Ionicons name='information-circle-outline' style={styles.icon} size={30} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('DownloadSelectionScreen', {webtoon, chapters})}>
                        <Ionicons name={download ? 'download-outline' : 'trash-outline' } style={styles.icon} size={30} />
                    </TouchableOpacity>

                </View>

            </View>

            {download && (
                <View style={styles.content}>
                    <FastImage source={{ uri: webtoon.imageUrl }} style={styles.image} resizeMode="cover" />

                    <View style={styles.detailsContainer}>
                        {webtoon.details && (
                            <View style={styles.statsContainer}>
                                <DetailItem icon="eye-outline" text={`Views: ${webtoon.details.views}`} />
                                <DetailItem icon="bookmark-outline" text={`Bookmarks: ${webtoon.details.bookmarks}`} />
                                <DetailItem icon="time-outline" text={`Status: ${webtoon.details.status}`} />
                            </View>
                        )}
                            <View style={styles.buttonContainer}>

                                <TouchableOpacity style={styles.button} onPress={handleReadChapter}>
                                    <Text style={styles.buttonText}>Read Chapter 1</Text>
                                </TouchableOpacity>

                                <View style={styles.buttonSeparator} />

                                <TouchableOpacity style={styles.button} onPress={() => handleBookmark(navigation)}>
                                    <Ionicons name="bookmark-outline" style={styles.buttonIcon} size={24} />
                                    <Text style={styles.buttonText}>Bookmark</Text>
                                </TouchableOpacity>

                            </View>
                    </View>

                </View>
            )}

            <Text style={[styles.title, {marginTop: download ? 15 : 0}]}>{webtoon.name}</Text>

            <Modal visible={isPopupVisible} transparent={true}>
                <InfoPopup summary={download ? webtoon.details.summary : webtoon.summary} setPopupVisible={setPopupVisible} />
            </Modal>

            <Modal visible={isAuthOverlayVisible} transparent={true}>
                <AuthOverlay toggleAuthOverlay={toggleAuthOverlay} />
            </Modal>

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        marginBottom: 5,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    arrowBack: {
        color: 'tomato',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    content: {
        flexDirection: 'row',
    },
    image: {
        width: 40*vw,
        aspectRatio: 9 / 16,
        borderRadius: 10,
        marginRight: 16,
    },
    detailsContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    statsContainer: {
        flex: 1,
        justifyContent: 'center',
        marginTop: 15
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
        marginBottom: 15
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'tomato',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 16,
        width: '100%',
    },
    buttonIcon: {
        marginRight: 8,
        color: 'white',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
    buttonSeparator: {
        height: 8,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        color: 'tomato',
        marginHorizontal: 10,
    },
});

export default WebtoonDetailHeader;