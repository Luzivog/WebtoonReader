import * as React from 'react';
import { View, Text } from 'react-native';

function BookmarksScreen(): JSX.Element {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 26, fontWeight: 'bold', color: 'white' }}>Bookmarks Screen</Text>
        </View>
    );
}

export default BookmarksScreen;