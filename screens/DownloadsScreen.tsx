import { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Text } from 'react-native';
import RNFS from 'react-native-fs';
import WebtoonCard from './components/WebtoonCard';
import { StatusBarHeight, vh, vw } from '../utils/config';
import { useIsFocused } from '@react-navigation/native';
import LoadingScreen from './LoadingScreen';

const numColumns = 2;

function DownloadsScreen(): JSX.Element {

    const isFocused = useIsFocused();
    const [webtoons, setWebtoons] = useState<{cover: string, name: string}[]>([]);
    const [loaded, setLoaded] = useState(false);
    const downloadPath = `${RNFS.DocumentDirectoryPath}/downloads/`;

    useEffect(() => {
        if (isFocused) {
            const fetchCovers = async (downloadPath: string): Promise<void> => {
                try {
                    const webtoonFiles = await RNFS.readDir(downloadPath);
                    const webtoonPromises = webtoonFiles.map(async (webtoonFile) => {
                        const webtoonPath = `${downloadPath}${webtoonFile.name}`;
                        const webtoonPathFiles = (await RNFS.readDir(webtoonPath)).map(f => f.name);
                        if (webtoonPathFiles.includes('cover') && webtoonPathFiles.includes('name')) return {
                            cover: `file://${webtoonPath}/cover`,
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
                    if (webtoonsFetched.length % 2 != 0) webtoonsFetched.push({cover: '', name: ''});
                    setWebtoons(webtoonsFetched);
                } catch {};
                setLoaded(true);
            };
            fetchCovers(downloadPath);
        };
    }, [isFocused]);
    
    return (
        <View style={styles.container}>
            {
                !loaded ? (<LoadingScreen/>) : webtoons.length == 0 ? (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 26, fontWeight: 'bold', color: 'white'  }}>Nothing downloaded</Text>
                    </View>
                ) : (
                    <FlatList
                        data={webtoons}
                        renderItem={({ item }: {item: {cover: string, name: string}}) => {
                            return item.name != '' ? (
                                <View style={styles.item}>
                                    <WebtoonCard 
                                        uri={item.cover}
                                        webtoonName={item.name}
                                        width={42*vw}
                                        onPress={()=>{}}
                                    />
                                </View>
                            ) : (<View style={{width: 42*vw}}/>)
                        }}
                        keyExtractor={(_, index) => index.toString()}
                        columnWrapperStyle={{justifyContent:'space-evenly'}}
                        numColumns={numColumns}
                        contentContainerStyle={styles.list}
                        initialNumToRender={webtoons.length}
                    />
                )
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#252525',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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