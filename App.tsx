import React from 'react';
import MainContainer from './navigation/MainContainer';
import LoginScreen from './navigation/Screens/LoginScreen';


require('dotenv').config();
console.log(process.env);

export default function App(): JSX.Element {
	return (
		<MainContainer/>
	);
};
