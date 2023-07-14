import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import SearchScreen from './Screens/SearchScreen';
import BookmarksScreen from './Screens/BookmarksScreen';
import DownloadsScreens from './Screens/DownloadsScreen';
import HomeContainer from './stacks/HomeStack';
import { config } from './config';

//Screen names
const homeName = "Home";
const searchName = "Search";
const bookmarksName = "Bookmarks";
const downloadsName = "Downloads";

const Tab = createBottomTabNavigator();

function MainContainer() {
	return (
		<NavigationContainer theme={config.CustomDarkTheme}>
			<Tab.Navigator
				initialRouteName={homeName}
				screenOptions={({ route }) => ({
					headerShown: false,
					tabBarStyle: [{ backgroundColor: 'black', height: 60 }],
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

				<Tab.Screen name={homeName} component={HomeContainer} />
				<Tab.Screen name={searchName} component={SearchScreen} />
				<Tab.Screen name={bookmarksName} component={BookmarksScreen} />
				<Tab.Screen name={downloadsName} component={DownloadsScreens} />

			</Tab.Navigator>
		</NavigationContainer>
	);
}

export default MainContainer;