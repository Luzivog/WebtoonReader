import * as React from 'react';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import DownloadsScreen from '../../screens/DownloadsScreen';
import DownloadDetailsScreen from '../../screens/DownloadsDetailsScreen';
import { RouteProp } from '@react-navigation/native';

export type DownloadedWebtoonObject = {
    formattedName: string,
    name: string;
    summary: string;
};

type RootStackParamList = {
    DownloadsScreen: undefined;
    DownloadsDetailsScreen: DownloadedWebtoonObject;
};

export type DownloadsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DownloadsScreen'>;

export type DownloadsDetailsScreenRouteProp = RouteProp<RootStackParamList, 'DownloadsDetailsScreen'>;


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
                name="DownloadsDetailsScreen"
                component={DownloadDetailsScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
