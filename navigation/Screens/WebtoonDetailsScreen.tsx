import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ListRenderItem } from 'react-native';
import { WebtoonDetailsScreenNavigationProp, WebtoonDetailsScreenRouteProp } from '../stacks/WebtoonStack';
import isObjectEmpty, { fetchAllChapters, fetchWebtoonDetails } from '../utils';
import { FlatList } from 'react-native-gesture-handler';
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
        <Text style={styles.chapterName}>{item.name}</Text>
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
  const [chapters, setChapters] = useState(webtoon.chapters);  // new state for chapters

  const fetchDetails = useCallback(async () => {
    if (isObjectEmpty(webtoon.details)) {
      await fetchWebtoonDetails(webtoon);
    } else {
      await fetchAllChapters(webtoon);
    }
    setChapters(webtoon.chapters); // Update chapters state
    setIsLoading(false);
    console.log(webtoon.chapters.length);
  }, [webtoon.details]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  if (isLoading) return <LoadingScreen/>;

  return (
    <FlatList 
      data={chapters} 
      extraData={chapters}
      style={styles.chaptersContainer} 
      removeClippedSubviews={true}
      ListHeaderComponent={
        WebtoonDetailHeader(navigation, webtoon, isPopupVisible, setPopupVisible)
      } 
      renderItem={({ item }) => (
        <RenderItem 
          item={item}
          onPress={() => navigation.navigate('ChapterScreen', {webtoon: webtoon, chapter: item})}
        />
      )}
    />
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
