import * as React from 'react';
import { View, TouchableOpacity, Image, Text, Modal, StyleSheet } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import Webtoon from "../../Webtoon"
import DetailItem from "./DetailItem"
import InfoPopup from "./InfoPopup"
import AuthOverlay from './AuthOverlay';

const handleReadChapter = () => {
    // Add logic to handle reading chapter 1
};

const handleBookmark = () => {
    // Add logic to handle bookmarking
};

const handleDownload = () => {
    // Add download functionality here
};

const WebtoonDetailHeader = (

    navigation: any,
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

                    <TouchableOpacity onPress={handleDownload}>
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

                    <TouchableOpacity style={styles.button} onPress={() => toggleAuthOverlay(true)}>
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
