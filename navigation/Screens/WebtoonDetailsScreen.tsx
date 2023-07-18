import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { WebtoonDetailsScreenNavigationProp, WebtoonDetailsScreenRouteProp } from '../stacks/WebtoonStack';
import isObjectEmpty, { fetchAllChapters, fetchWebtoonDetails } from '../utils';
import { FlatList } from 'react-native-gesture-handler';
import { FlashList } from "@shopify/flash-list";
import WebtoonDetailHeader from './components/WebtoonDetailsHeader';
import LoadingScreen from './LoadingScreen';

interface RenderItemProps {
	item: { name: string; released: string; url: string };
	onPress: () => void;
}

const RenderItem: React.FC<RenderItemProps> = React.memo(({ item, onPress }) => {
	return (
		<TouchableOpacity
			key={item.name}
			style={styles.chapterItem}
			onPress={onPress}
		>
			<View style={styles.chapterItemContent}>
				<Text style={styles.chapterName} numberOfLines={1} ellipsizeMode='tail'>{item.name}</Text>
				<Text style={styles.chapterReleased}>{item.released}</Text>
			</View>
		</TouchableOpacity>
	);
});

const WebtoonDetailsScreen = ({ navigation, route }: {
	navigation: WebtoonDetailsScreenNavigationProp,
	route: WebtoonDetailsScreenRouteProp
}) => {

	const { webtoon } = route.params;
	const [isLoading, setIsLoading] = useState(true);
	const [isPopupVisible, setPopupVisible] = useState(false);
	const [chapters, setChapters] = useState(webtoon.chapters);

	const fetchDetails = useCallback(async () => {

		if (isObjectEmpty(webtoon.details)) await fetchWebtoonDetails(webtoon);
		else await fetchAllChapters(webtoon);

		setChapters(webtoon.chapters);
		setIsLoading(false);

	}, [webtoon.details]);

	useEffect(() => {
		fetchDetails();
	}, [fetchDetails]);

	if (isLoading) return <LoadingScreen />;

	return (
		<View style={styles.chaptersContainer}>
			<FlashList
				data={chapters}
				extraData={chapters}
				removeClippedSubviews={true}
				estimatedItemSize={50}
				ListHeaderComponent={
					WebtoonDetailHeader(navigation, webtoon, isPopupVisible, setPopupVisible)
				}
				renderItem={({ item }) => (
					<RenderItem
						item={item}
						onPress={() => navigation.navigate('ChapterScreen', { webtoon: webtoon, chapter: item })}
					/>
				)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	chaptersContainer: {
		marginTop: StatusBar.currentHeight,
		alignContent: 'center',
		width: '100%',
		height: '100%',
		paddingBottom: 30,
	},
	chapterItem: {
		height: 50,
		backgroundColor: '#353535',
		borderRadius: 5,
		paddingHorizontal: 10,
		paddingVertical: 15,
		marginBottom: 10,
		width: '95%',
		alignSelf: 'center',
	},
	chapterItemContent: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	chapterName: {
		color: 'white',
		fontSize: 16,
		flex: 0.5,
	},
	chapterReleased: {
		color: 'white',
		fontSize: 14,
		textAlign: 'right',
		flex: 0.5,
	},
});

export default WebtoonDetailsScreen;
