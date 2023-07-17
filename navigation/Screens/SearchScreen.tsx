import * as React from 'react';
import { View, Text, StatusBar } from 'react-native';

export default function SearchScreen(): JSX.Element {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 26, fontWeight: 'bold', color: 'white'  }}>Search Screen</Text>
        </View>
    );
}