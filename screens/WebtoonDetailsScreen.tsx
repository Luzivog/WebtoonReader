import { useState, useEffect, useCallback } from 'react';
import { WebtoonDetailsScreenNavigationProp, WebtoonDetailsScreenRouteProp } from '../navigation/stacks/WebtoonStack';
import { isObjectEmpty, fetchAllChapters, fetchWebtoonDetails, fetchDownloadedChapters } from '../utils/utils';
import WebtoonDetailHeader from './components/WebtoonDetailsHeader';
import LoadingScreen from './LoadingScreen';
import Webtoon, { Chapter } from '../utils/Webtoon';
import ChapterList from './components/ChapterList';
import { DownloadedWebtoonObject } from '../navigation/stacks/DownloadsStack';
import RNFS from 'react-native-fs';

const WebtoonDetailsScreen = ({ navigation, route }: {
	navigation: WebtoonDetailsScreenNavigationProp,
	route: WebtoonDetailsScreenRouteProp
}) => {

	const { webtoon }: { webtoon: Webtoon | DownloadedWebtoonObject } = route.params;
	const [isLoading, setIsLoading] = useState(true);
	const [isPopupVisible, setPopupVisible] = useState(false);
	const [isAuthOverlayVisible, toggleAuthOverlay] = useState(false);
	const [chapters, setChapters] = useState<Chapter[]>([]);

	const fetchDetails = useCallback(async () => {

		if ('imageUrl' in webtoon) {
			setChapters(webtoon.chapters);
			if (isObjectEmpty(webtoon.details)) await fetchWebtoonDetails(webtoon);
			else if (!webtoon.allChapters) {
				await fetchAllChapters(webtoon);
				webtoon.allChapters = true;
			};
			setChapters(webtoon.chapters);
		} else setChapters(await fetchDownloadedChapters(webtoon));
		setIsLoading(false);
		
	}, [chapters]);

	useEffect(() => {
		fetchDetails();
	}, [chapters]);

	if (isLoading) return <LoadingScreen />;

	return (
		<ChapterList
			chapters={chapters}
			header={WebtoonDetailHeader(navigation, webtoon, isPopupVisible, isAuthOverlayVisible, setPopupVisible, toggleAuthOverlay, chapters)}
			onPress={(chapter: Chapter) => navigation.navigate('ChapterScreen', { chapters: chapters, chapter: chapter })}
		/>
	);
};

export default WebtoonDetailsScreen;
