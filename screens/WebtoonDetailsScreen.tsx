import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { WebtoonDetailsScreenNavigationProp, WebtoonDetailsScreenRouteProp } from '../navigation/stacks/WebtoonStack';
import { isObjectEmpty, fetchAllChapters, fetchWebtoonDetails } from '../utils/utils';
import { FlashList } from "@shopify/flash-list";
import WebtoonDetailHeader from './components/WebtoonDetailsHeader';
import LoadingScreen from './LoadingScreen';
import Webtoon from '../utils/Webtoon';
import ChapterList from './components/ChapterList';

const WebtoonDetailsScreen = ({ navigation, route }: {
	navigation: WebtoonDetailsScreenNavigationProp,
	route: WebtoonDetailsScreenRouteProp
}) => {

	const { webtoon }: { webtoon: Webtoon } = route.params;
	const [isLoading, setIsLoading] = useState(true);
	const [isPopupVisible, setPopupVisible] = useState(false);
	const [isAuthOverlayVisible, toggleAuthOverlay] = useState(false);
	const [chapters, setChapters] = useState(webtoon.chapters);

	const fetchDetails = useCallback(async () => {

		if (isObjectEmpty(webtoon.details)) await fetchWebtoonDetails(webtoon);
		else if (!webtoon.allChapters) {
			await fetchAllChapters(webtoon);
			webtoon.allChapters = true;
		};

		setChapters(webtoon.chapters);
		setIsLoading(false);

	}, [webtoon.details]);

	useEffect(() => {
		fetchDetails();
	}, [fetchDetails]);

	if (isLoading) return <LoadingScreen />;

	return (
		<ChapterList
			chapters={chapters}
			header={WebtoonDetailHeader(navigation, webtoon, isPopupVisible, isAuthOverlayVisible, setPopupVisible, toggleAuthOverlay)}
			onPress={(chapter: { name: string; released: string, url: string }) => navigation.navigate('ChapterScreen', { webtoon: webtoon, chapter: chapter })}			
		/>
	);
};

export default WebtoonDetailsScreen;
