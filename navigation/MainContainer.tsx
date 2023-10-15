import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import SearchScreen from '../screens/SearchScreen';
import BookmarksScreen from '../screens/BookmarksScreen';
import HomeStack from './stacks/HomeStack';
import DownloadsStack from './stacks/DownloadsStack';
import { CustomDarkTheme, navigationBarHeight } from '../utils/config';
import { StatusBar, View } from 'react-native';

//Screen names
const homeName = "Home";
const searchName = "Search";
const bookmarksName = "Bookmarks";
const downloadsName = "Downloads";

const Tab = createBottomTabNavigator();

function MainContainer() {
	return (
		<View style={{width: '100%', height: '100%',backgroundColor: '#252525'}}>
		<StatusBar translucent backgroundColor='transparent' />
			<NavigationContainer theme={CustomDarkTheme}>
				<Tab.Navigator
					initialRouteName={homeName}
					screenOptions={({ route }) => ({
						headerShown: false,
						tabBarStyle: [{ backgroundColor: 'black', height: navigationBarHeight }],
						tabBarActiveTintColor: 'tomato',
						tabBarIcon: ({ focused, color, size }) => {
							let iconName;
							let rn = route.name;

							if (rn === homeName) iconName = focused ? 'home' : 'home-outline';
							else if (rn === searchName) iconName = focused ? 'search' : 'search-outline';
							else if (rn === bookmarksName) iconName = focused ? 'bookmarks' : 'bookmarks-outline';
							else iconName = focused ? 'download' : 'download-outline';

							return <Ionicons name={iconName} size={size} color={color} />;
						},
					})}
				>

					<Tab.Screen name={homeName} component={HomeStack} />
					<Tab.Screen name={searchName} component={SearchScreen} />
					<Tab.Screen name={bookmarksName} component={BookmarksScreen} />
					<Tab.Screen name={downloadsName} component={DownloadsStack} />

				</Tab.Navigator>
			</NavigationContainer>
			
		</View>
	);
}

export default MainContainer;