import * as React from 'react';
import { View, TouchableOpacity, Image, Text, Modal, StyleSheet } from "react-native"
import RNFS from 'react-native-fs';
import Ionicons from "react-native-vector-icons/Ionicons"
import Webtoon from "../../utils/Webtoon"
import DetailItem from "./DetailItem"
import InfoPopup from "./InfoPopup"
import AuthOverlay from './AuthOverlay';
import { WebtoonDetailsScreenNavigationProp } from '../../navigation/stacks/WebtoonStack';
import { deleteFolderRecursive, fetchChapterImageUrls, getBase64FromImageUrl, sanitizeFileName } from '../../utils/utils';

const handleReadChapter = () => {
    // Add logic to handle reading chapter 1
};

const handleBookmark = (navigation: WebtoonDetailsScreenNavigationProp) => {
    navigation.navigate("RegisterScreen")
};

const handleDownload = async (webtoon: Webtoon) => {

    //await deleteFolderRecursive(RNFS.DocumentDirectoryPath + '/downloads/');
    const webtoonName = webtoon.apiUrl.slice(1, -1).split("/").join("-");
    const dirPath = RNFS.DocumentDirectoryPath + '/downloads/' + webtoonName + "/";

    // Webtoon Folder
    if (!await RNFS.exists(dirPath)) await RNFS.mkdir(dirPath);

    // Cover Image Download
    if (!(await RNFS.exists(dirPath + "cover"))) {
        const base64Img = await getBase64FromImageUrl(webtoon.imageUrl);
        await RNFS.writeFile(dirPath + "cover", base64Img);
    };

    // Saving webtoon name
    if (!(await RNFS.exists(dirPath + "name"))) await RNFS.writeFile(dirPath + "name", webtoon.name);
    console.log(webtoonName);
    return
    // Chapter Folder
    const chaptersPath = dirPath + "chapters/";
    if (!await RNFS.exists(chaptersPath)) await RNFS.mkdir(chaptersPath);

    for (let i = webtoon.chapters.length - 1; i >= 0; i--) {

        const chapterName = sanitizeFileName(webtoon.chapters[i].name);
        console.log(`Downloading chapter: ${chapterName}`);

        const chapterPath = `${chaptersPath}${chapterName}/`;
        if (!await RNFS.exists(chapterPath)) await RNFS.mkdir(chapterPath);

        const imagesUrls = await fetchChapterImageUrls(webtoon, webtoon.chapters[i]);

        const downloadPromises = imagesUrls.map(async (imageUrl) => {
            const base64Img = await getBase64FromImageUrl(imageUrl);
            const imgName = imageUrl.split("/").slice(-1)[0];
            console.log(`Downloading: ${imgName}`);
            await RNFS.writeFile(`${chapterPath}${imgName}`, base64Img);
        });

        await Promise.all(downloadPromises);
        await RNFS.writeFile(chapterPath + "done", "");

        console.log(`Finished downloading chapter: ${webtoon.chapters[i].name}`);
    };
};

const WebtoonDetailHeader = (

    navigation: WebtoonDetailsScreenNavigationProp,
    webtoon: Webtoon,
    isPopupVisible: boolean,
    isAuthOverlayVisible: boolean,
    setPopupVisible: (visible: boolean) => void,
    toggleAuthOverlay: (visible: boolean) => void

) => {

    return (
        <View style={styles.container}>

            <View style={styles.header}>

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name='arrow-back' style={styles.arrowBack} size={40} />
                </TouchableOpacity>

                <View style={styles.iconContainer}>

                    <TouchableOpacity onPress={() => setPopupVisible(!isPopupVisible)}>
                        <Ionicons name='information-circle-outline' style={styles.icon} size={30} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleDownload(webtoon)}>
                        <Ionicons name='download-outline' style={styles.icon} size={30} />
                    </TouchableOpacity>

                </View>

            </View>

            <View style={styles.content}>
                <Image source={{ uri: webtoon.imageUrl }} style={styles.image} resizeMode="cover" />

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

            <Text style={styles.title}>{webtoon.name}</Text>

            <Modal visible={isPopupVisible} transparent={true}>
                <InfoPopup details={webtoon.details} setPopupVisible={setPopupVisible} />
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
        marginBottom: 8,
    },
    arrowBack: {
        color: 'tomato',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 15,
        textAlign: 'center',
    },
    content: {
        flexDirection: 'row',
    },
    image: {
        width: 150,
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
