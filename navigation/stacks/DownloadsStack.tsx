import * as React from 'react';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import DownloadsScreen from '../../screens/DownloadsScreen';
import { RouteProp } from '@react-navigation/native';
import WebtoonStack from './WebtoonStack';

export type DownloadedWebtoonObject = {
    formattedName: string;
    name: string;
    summary: string;
};

type RootStackParamList = {
    DownloadsScreen: undefined;
    WebtoonStack: { screen: string, params: {webtoon: DownloadedWebtoonObject} };
};

export type DownloadsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DownloadsScreen'>;

export type WebtoonStackRouteProp = RouteProp<RootStackParamList, 'WebtoonStack'>;


const Stack = createStackNavigator<RootStackParamList>();

export default function DownloadsContainer(): JSX.Element {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="DownloadsScreen"
                component={DownloadsScreen}
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
