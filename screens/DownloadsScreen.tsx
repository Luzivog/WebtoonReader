import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions, StatusBar } from 'react-native';
import RNFS from 'react-native-fs';
import { config } from '../utils/config'

function DownloadsScreen(): JSX.Element {

    const [covers, setCovers] = useState<string[]>([]);
    const downloadPath = `${RNFS.DocumentDirectoryPath}/downloads/`;

    useEffect(() => {
        const fetchCovers = async (downloadPath: string): Promise<void> => {
            try {
                const webtoonFiles = await RNFS.readDir(downloadPath);
                const coverPromises = webtoonFiles.map(async (webtoonFile) => {
                    const coverPath = `${downloadPath}${webtoonFile.name}/cover`;
                    if (await RNFS.exists(coverPath)) return RNFS.readFile(coverPath);
                    return null;
                });
        
                const covers = await Promise.all(coverPromises);
                const coversFetched = covers.filter((cover): cover is string => cover !== null);
                setCovers(coversFetched);
            } catch (error) {
                console.error('An error occurred while fetching covers:', error);
            }
        };
        fetchCovers(downloadPath)
    }, []);

    const renderItem = ({ item }: {item: string}) => (
        <View style={styles.item}>
            <Image
                style={styles.image}
                source={{ uri: item }}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={covers}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};


const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const imageSize = (screenWidth - 30) / numColumns; // Assuming 10 padding on both sides and in between items

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#252525',
    },
    list: {
        marginTop: config.StatusBarHeight,
        paddingHorizontal: 10,
    },
    item: {
        padding: 10,
        width: imageSize,
        height: imageSize * (16 / 9),
    },
    image: {
        aspectRatio: 9 / 16,
        width: "100%",
    },
});

export default DownloadsScreen;