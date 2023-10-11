import React from 'react';
import MainContainer from './navigation/MainContainer';
global.Buffer = require('buffer').Buffer;

export default function App(): JSX.Element {
	return (
		<MainContainer/>
	);
};
