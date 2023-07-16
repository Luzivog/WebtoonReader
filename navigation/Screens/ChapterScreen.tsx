import { FlatList, Image, Dimensions, StatusBar, View} from "react-native";
import { ChapterScreenNavigationProp, ChapterScreenRouteProp } from "../stacks/WebtoonStack";
import { useState, useEffect } from "react";
import FastImage from 'react-native-fast-image'
import { fetchChapterImageUrls } from "../utils";
import LoadingScreen from "./LoadingScreen";

const screenWidth = Dimensions.get('window').width;

export default function ChapterScreen({ navigation, route }: {
	navigation: ChapterScreenNavigationProp,
	route: ChapterScreenRouteProp
}) {
    const { webtoon, chapter } = route.params;

    const [isLoading, setIsLoading] = useState(true);
    const [imageData, setImageData] = useState<Array<{uri: string, width: number, height: number}>>([]);

    useEffect(() => {
		(async () => {
            const urls = await fetchChapterImageUrls(webtoon, chapter);
            setIsLoading(false);

            for (const url of urls) {
                await new Promise((resolve, reject) => {
                    Image.getSize(url, (width, height) => {
                        setImageData((prevData) => [...prevData, {uri: url, width, height}]);
                        resolve(null);
                    }, reject);
                });
            }
		})();
	}, [webtoon, chapter]);

    if (isLoading) return <LoadingScreen/>;

    return (
        <View>
            <StatusBar hidden/>
            <FlatList
                showsVerticalScrollIndicator= {false}
                data={imageData}
                renderItem={({ item }) => {
                    const scaleFactor = screenWidth / item.width;
                    const imageHeight = item.height * scaleFactor;
                    return (
                        <FastImage 
                            source={{ uri: item.uri }} 
                            style={{ width: screenWidth, height: imageHeight }} 
                        />
                    );
                }}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
}