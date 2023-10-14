import { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Image, Dimensions, StatusBar } from 'react-native';
import RNFS from 'react-native-fs';
import WebtoonCard from './components/WebtoonCard';
import { StatusBarHeight, navigationBarHeight, vh, vw } from '../utils/config';

const numColumns = 2;

function DownloadsScreen(): JSX.Element {

    const [webtoons, setWebtoons] = useState<{cover: string, name: string}[]>([]);
    const downloadPath = `${RNFS.DocumentDirectoryPath}/downloads/`;

    useEffect(() => {
        const fetchCovers = async (downloadPath: string): Promise<void> => {
            try {
                const webtoonFiles = await RNFS.readDir(downloadPath);
                const webtoonPromises = webtoonFiles.map(async (webtoonFile) => {
                    const webtoonPath = `${downloadPath}${webtoonFile.name}`;
                    if (await RNFS.exists(webtoonPath+"/cover") && await RNFS.exists(webtoonPath+"/name")) return {
                        cover: await RNFS.readFile(webtoonPath+"/cover"),
                        name: await RNFS.readFile(webtoonPath+"/name")
                    };
                    return null;
                });
        
                const webtoons = await Promise.all(webtoonPromises);
                const webtoonsFetched = webtoons.filter((webtoon): webtoon is {cover: string, name: string} => 
                    webtoon !== null && webtoon !== undefined &&
                    typeof webtoon.cover === 'string' && 
                    typeof webtoon.name === 'string'
                );
                setWebtoons(webtoonsFetched);
            } catch (error) {
                console.error('An error occurred while fetching covers:', error);
            }
        };
        fetchCovers(downloadPath)
    }, []);

    webtoons.forEach(w => console.log(w.name));

    return (
        <View style={styles.container}>
            <FlatList
                data={webtoons}
                renderItem={({ item }: {item: {cover: string, name: string}}) => {
                    return (
                    <View style={styles.item}>
                        <WebtoonCard 
                            uri={item.cover}
                            webtoonName={item.name}
                            width={42*vw}
                            onPress={()=>{}}
                        />
                    </View>
                )}}
                keyExtractor={(_, index) => index.toString()}
                columnWrapperStyle={{justifyContent:'space-evenly'}}
                numColumns={numColumns}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#252525',
    },
    list: {
        marginTop: StatusBarHeight,
        paddingBottom: 5*vh
    },
    item: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 1*vh
    },
    image: {
        aspectRatio: 9 / 16,
        width: "100%",
    },
});

export default DownloadsScreen;