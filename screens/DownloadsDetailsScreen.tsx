import * as React from 'react';
import { View, Text } from 'react-native';
import { DownloadedWebtoonObject, DownloadsDetailsScreenRouteProp } from '../navigation/stacks/DownloadsStack';



export default function DownloadDetailsScreen({route}:{
    route: DownloadsDetailsScreenRouteProp
}): JSX.Element {
    const { formattedName, name, summary } = route.params;

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 26, fontWeight: 'bold', color: 'white' }}>Search Screen</Text>
        </View>
    );
}