import React from 'react';
import MainContainer from './navigation/MainContainer';
import { Provider } from 'react-redux';
import store from './utils/store'; // Make sure this path is correct

global.Buffer = require('buffer').Buffer;
global.downloadingChapters = [];

export default function App(): JSX.Element {
    return (
        <Provider store={store}>
            <MainContainer/>
        </Provider>
    );
}