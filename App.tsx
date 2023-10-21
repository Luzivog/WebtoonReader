import React from 'react';
import MainContainer from './navigation/MainContainer';

global.Buffer = require('buffer').Buffer;
global.downloadingChapters = {};
global.downloadingQueue = [];

export default function App(): JSX.Element {
    return (
        <MainContainer/>
    );
}