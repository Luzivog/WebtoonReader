import * as React from 'react';
import { RouteProp } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import WebtoonDetailsScreen from '../Screens/WebtoonDetailsScreen';
import Webtoon from '../Webtoon';
import ChapterScreen from '../Screens/ChapterScreen';

type RootStackParamList = {
    WebtoonDetailsScreen: { webtoon: Webtoon };
    ChapterScreen: {webtoon: Webtoon, chapter: {name: string, released: string, url: string}}
};

export type WebtoonDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'WebtoonDetailsScreen'>;
export type WebtoonDetailsScreenRouteProp = RouteProp<RootStackParamList, 'WebtoonDetailsScreen'>;

export type ChapterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ChapterScreen'>;
export type ChapterScreenRouteProp = RouteProp<RootStackParamList, 'ChapterScreen'>;


const Stack = createStackNavigator<RootStackParamList>();

export default function WebtoonStack({navigation}: {navigation: any}): JSX.Element {
    return (
        <Stack.Navigator 
        initialRouteName='WebtoonDetailsScreen'
        screenListeners={{
            state: (e) => {
              if (e && e.data && (e.data as {state:{index: number}}).state.index == 1) {
                navigation.getParent().setOptions({
                    tabBarStyle: { 
                        backgroundColor: 'black', 
                        display: 'none' 
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
        </Stack.Navigator>

    );
}