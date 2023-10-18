import { View, StyleSheet, Text } from "react-native";
import Webtoon from "../utils/Webtoon";
import { DownloadSelectionScreenNavigationProp, DownloadSelectionScreenRouteProp } from "../navigation/stacks/WebtoonStack";
import { DownloadedWebtoonObject } from "../navigation/stacks/DownloadsStack";

export default function DonwloadSelectionScreen({ navigation, route }: {
	navigation: DownloadSelectionScreenNavigationProp,
	route: DownloadSelectionScreenRouteProp
})  {

	const { webtoon }: { webtoon: Webtoon | DownloadedWebtoonObject } = route.params;

	return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 26, fontWeight: 'bold', color: 'white' }}>Download Selection Screen</Text>
        </View>
	);
}

const styles = StyleSheet.create({
	
});