import { FlatList, Image, Dimensions } from "react-native";
import { ChapterScreenNavigationProp, ChapterScreenRouteProp } from "../stacks/WebtoonStack";
import { useState, useEffect } from "react";
import { fetchChapterImageUrls } from "../utils";
import LoadingScreen from "./LoadingScreen";

export default function ChapterScreen({ navigation, route }: {
	navigation: ChapterScreenNavigationProp,
	route: ChapterScreenRouteProp
}) {

    const { webtoon, chapter } = route.params;

    const [isLoading, setIsLoading] = useState(true);
    const [imageUrls, setImageUrls] = useState<Array<string>>([]);

	useEffect(() => {
		(async () => {
			if (imageUrls.length == 0) {
                const urls = await fetchChapterImageUrls(webtoon, chapter);
                setImageUrls(urls);
                setIsLoading(false);
            };
		})();
	}, [webtoon, chapter]);

	if (isLoading) return <LoadingScreen/>;

    const screenWidth = Dimensions.get('window').width;

    return (
        <FlatList
          data={imageUrls}
          renderItem={({ item }) => (
            <Image 
                source={{ uri: item }} 
                style={{ width: screenWidth, flex: 1 }} 
                resizeMode="contain" 
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      );
}
