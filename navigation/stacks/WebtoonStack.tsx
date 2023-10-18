import * as React from 'react';
import { RouteProp } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import WebtoonDetailsScreen from '../../screens/WebtoonDetailsScreen';
import Webtoon, { Chapter } from '../../utils/Webtoon';
import ChapterScreen from '../../screens/ChapterScreen';
import RegisterScreen from '../../screens/RegisterScreen';
import LoginScreen from '../../screens/LoginScreen';
import { DownloadedWebtoonObject } from './DownloadsStack';
import DownloadSelectionScreen from '../../screens/DownloadSelectionScreen';

type RootStackParamList = {
    WebtoonDetailsScreen: { webtoon: Webtoon | DownloadedWebtoonObject };
    ChapterScreen: { chapters: Chapter[], chapter: Chapter };
    RegisterScreen: undefined;
    LoginScreen: undefined;
    DownloadSelectionScreen: { webtoon: Webtoon | DownloadedWebtoonObject };
};

export type WebtoonDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'WebtoonDetailsScreen'>;
export type WebtoonDetailsScreenRouteProp = RouteProp<RootStackParamList, 'WebtoonDetailsScreen'>;

export type ChapterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ChapterScreen'>;
export type ChapterScreenRouteProp = RouteProp<RootStackParamList, 'ChapterScreen'>;

export type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'RegisterScreen'>;
export type RegisterScreenRouteProp = RouteProp<RootStackParamList, 'RegisterScreen'>;

export type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LoginScreen'>;
export type LoginScreenRouteProp = RouteProp<RootStackParamList, 'LoginScreen'>;

export type DownloadSelectionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DownloadSelectionScreen'>;
export type DownloadSelectionScreenRouteProp = RouteProp<RootStackParamList, 'DownloadSelectionScreen'>;

const Stack = createStackNavigator<RootStackParamList>();

type RouteState = {
    index: number;
    routes: { name: string }[];
};

const screenWithVisibleTabBar = [
    'WebtoonDetailsScreen',
    'DownloadSelectionScreen'
];

export default function WebtoonStack({ navigation }: { navigation: any }): JSX.Element {
    return (
        <Stack.Navigator 
            initialRouteName='WebtoonDetailsScreen'
            screenListeners={{
                state: (e) => {

                    const currentState = e.data as { state: RouteState };
                    const currentRoute = currentState?.state?.routes[currentState.state.index]?.name;

                    if (currentRoute) {
                        if (screenWithVisibleTabBar.includes(currentRoute)) {
                            navigation.getParent().setOptions({
                                tabBarStyle: { 
                                    backgroundColor: 'black', 
                                    height: 60 
                                }
                            });
                        } else {
                            navigation.getParent().setOptions({
                                tabBarStyle: { 
                                    backgroundColor: 'black', 
                                    height: 0 
                                }
                            });
                        }
                    }
                },
            }}
        >
            <Stack.Screen
                name="WebtoonDetailsScreen"
                component={WebtoonDetailsScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="DownloadSelectionScreen"
                component={DownloadSelectionScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ChapterScreen"
                component={ChapterScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="RegisterScreen"
                component={RegisterScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>

    );
}