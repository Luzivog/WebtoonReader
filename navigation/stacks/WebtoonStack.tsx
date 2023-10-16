import * as React from 'react';
import { RouteProp } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import WebtoonDetailsScreen from '../../screens/WebtoonDetailsScreen';
import Webtoon, { Chapter } from '../../utils/Webtoon';
import ChapterScreen from '../../screens/ChapterScreen';
import RegisterScreen from '../../screens/RegisterScreen';
import LoginScreen from '../../screens/LoginScreen';
import { DownloadedWebtoonObject } from './DownloadsStack';

type RootStackParamList = {
    WebtoonDetailsScreen: { webtoon: Webtoon | DownloadedWebtoonObject };
    ChapterScreen: {chapters: Chapter[], chapter: Chapter};
    RegisterScreen: undefined;
    LoginScreen: undefined;
};

export type WebtoonDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'WebtoonDetailsScreen'>;
export type WebtoonDetailsScreenRouteProp = RouteProp<RootStackParamList, 'WebtoonDetailsScreen'>;

export type ChapterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ChapterScreen'>;
export type ChapterScreenRouteProp = RouteProp<RootStackParamList, 'ChapterScreen'>;

export type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'RegisterScreen'>;
export type RegisterScreenRouteProp = RouteProp<RootStackParamList, 'RegisterScreen'>;

export type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LoginScreen'>;
export type LoginScreenRouteProp = RouteProp<RootStackParamList, 'LoginScreen'>;


const Stack = createStackNavigator<RootStackParamList>();

export default function WebtoonStack({navigation}: {navigation: any}): JSX.Element {
    return (
        <Stack.Navigator 
        initialRouteName='WebtoonDetailsScreen'
        screenListeners={{
            state: (e) => {
              if (e && e.data && (e.data as {state:{index: number}}).state.index >= 1) {
                navigation.getParent().setOptions({
                    tabBarStyle: { 
                        backgroundColor: 'black', 
                        height: 0 
                    }
                })
              }
              else {
                navigation.getParent().setOptions({
                    tabBarStyle: { 
                        backgroundColor: 'black', 
                        height: 60
                    }
                })
              };
            },
          }}
        >
            <Stack.Screen
                name="WebtoonDetailsScreen"
                component={WebtoonDetailsScreen}
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