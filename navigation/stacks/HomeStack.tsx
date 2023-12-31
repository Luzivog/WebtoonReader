import * as React from 'react';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import HomeScreen from '../../screens/HomeScreen';
import Webtoon from '../../utils/Webtoon';
import WebtoonStack from './WebtoonStack';
import { DownloadedWebtoonObject } from './DownloadsStack';

type RootStackParamList = {
    HomeScreen: undefined;
    WebtoonStack: { screen: string, params: {webtoon: Webtoon} };
};

export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomeScreen'>;

const Stack = createStackNavigator<RootStackParamList>();

export default function HomeContainer(): JSX.Element {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="WebtoonStack"
                component={WebtoonStack}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>

    );
}