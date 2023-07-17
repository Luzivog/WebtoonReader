import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import Webtoon from '../Webtoon';
import { loadMainWebtoons } from '../utils';
import WebtoonCards from './components/WebtoonCards';
import { HomeScreenNavigationProp } from '../stacks/HomeStack';

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
            <ScrollView style={styles.scrollView} horizontal showsHorizontalScrollIndicator={false}>
                <WebtoonCards webtoons={mostViewedWebtoons} navigation={navigation}/>
            </ScrollView>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>New</Text>
            </View>
            <ScrollView style={[styles.scrollView]} horizontal showsHorizontalScrollIndicator={false}>
                <WebtoonCards webtoons={newWebtoons} navigation={navigation}/>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: StatusBar.currentHeight,
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
    scrollView: {
    },
});