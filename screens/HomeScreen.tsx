import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Webtoon from '../utils/Webtoon';
import { loadMainWebtoons } from '../utils/utils';
import { HomeScreenNavigationProp } from '../navigation/stacks/HomeStack';
import WebtoonCard from './components/WebtoonCard';
import { StatusBarHeight } from '../utils/config';

export default function HomeScreen({navigation}: {
        navigation: HomeScreenNavigationProp, 
    }): JSX.Element {
                
    const [webtoons, setWebtoons] = useState<Webtoon[]>([]);

    useEffect(() => {
        (async () => {
            const webtoonList = await loadMainWebtoons();
            setWebtoons(webtoonList);
        })()
    }, []);

    const mostViewedWebtoons = webtoons.slice(0, 12);
    const newWebtoons = webtoons.slice(12, 24);

    return (
        <View style={styles.container}>
            <View style={[styles.sectionHeader, {marginTop: 10}]}>
                <Text style={styles.sectionHeaderText}>Most Viewed Today</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.cardContainer}>
                    {mostViewedWebtoons.map((webtoon, index) => (
                        <View style={{marginRight: index+1 == mostViewedWebtoons.length? 0 : 14}} key={index}>
                            <WebtoonCard
                                key={index}
                                uri={webtoon.imageUrl}
                                webtoonName={webtoon.name}
                                onPress={() => {navigation.navigate('WebtoonStack', { 
                                    screen: "WebtoonDetailsScreen", 
                                    params: {webtoon: webtoon}
                                })}}
                            />
                        </View>
                    ))}
                </View>
            </ScrollView>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>New</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.cardContainer}>
                    {newWebtoons.map((webtoon, index) => (
                        <View style={{marginRight: index+1 == newWebtoons.length? 0 : 14}} key={index}>
                            <WebtoonCard
                                key={index}
                                uri={webtoon.imageUrl}
                                webtoonName={webtoon.name}
                                onPress={() => {navigation.navigate('WebtoonStack', { 
                                    screen: "WebtoonDetailsScreen", 
                                    params: {webtoon: webtoon}
                                })}}
                            />
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: StatusBarHeight,
        flex: 1,
        backgroundColor: '#252525',
    },
    sectionHeader: {
        height: 40,
        justifyContent: 'center',
        paddingLeft: 20,
    },
    sectionHeaderText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        flexWrap: 'wrap',
    },
});