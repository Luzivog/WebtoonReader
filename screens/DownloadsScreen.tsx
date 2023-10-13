import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import RNFS from 'react-native-fs';

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#252525',
    },
    list: {
        paddingHorizontal: 10,
    },
    item: {
        flex: 1,
        padding: 10,
    },
    image: {
        aspectRatio: 9/16,
        width: "100%",
    },
});

export default DownloadsScreen;