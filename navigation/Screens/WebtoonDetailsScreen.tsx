import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { WebtoonDetailsScreenNavigationProp, WebtoonDetailsScreenRouteProp } from '../stacks/WebtoonStack';
import isObjectEmpty, { fetchWebtoonDetails } from '../utils';
import { FlatList } from 'react-native-gesture-handler';
import WebtoonDetailHeader from './components/WebtoonDetailsHeader';
import LoadingScreen from './LoadingScreen';

const WebtoonDetailsScreen = ({ navigation, route }: {
	navigation: WebtoonDetailsScreenNavigationProp,
	route: WebtoonDetailsScreenRouteProp
}) => {
	const { webtoon } = route.params;
	const [isLoading, setIsLoading] = useState(true);
	const [isPopupVisible, setPopupVisible] = useState(false);

	useEffect(() => {
		(async () => {
			if (isObjectEmpty(webtoon.details)) await fetchWebtoonDetails(webtoon);
			setIsLoading(false);
		})();
	}, [webtoon.details]);

	if (isLoading) return <LoadingScreen/>;

	return (

		<FlatList data={webtoon.chapters} style={styles.chaptersContainer} ListHeaderComponent={
			WebtoonDetailHeader(navigation, webtoon, isPopupVisible, setPopupVisible)
		} renderItem={({ item }) => (
			<TouchableOpacity
				key={item.name}
				style={styles.chapterItem}
				onPress={() => navigation.navigate('ChapterScreen', {webtoon: webtoon, chapter: item})}
			>
				<View style={styles.chapterItemContent}>
					<Text style={styles.chapterName}>{item.name}</Text>
					<Text style={styles.chapterReleased}>{item.released}</Text>
				</View>

			</TouchableOpacity>

		)}></FlatList>

	);
};

const styles = StyleSheet.create({
	chaptersContainer: {
		marginHorizontal: 10,
	},
	chapterItem: {
		backgroundColor: '#353535',
		borderRadius: 5,
		paddingHorizontal: 10,
		paddingVertical: 15,
		marginBottom: 10,
		width: '100%',
	},
	chapterItemContent: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	chapterName: {
		color: 'white',
		fontSize: 16,
	},
	chapterReleased: {
		color: 'white',
		fontSize: 14,
		textAlign: 'right',
	},
});

export default WebtoonDetailsScreen;