import { FlashList } from "@shopify/flash-list";
import React from "react";
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Chapter } from "../../utils/Webtoon";

interface RenderItemProps {
	item: Chapter;
	onPress: (chapter: Chapter) => void;
}

const RenderItem: React.FC<RenderItemProps> = React.memo(({ item, onPress }) => {
	return (
		<TouchableOpacity
			key={item.name}
			style={styles.chapterItem}
			onPress={() => onPress(item)}
		>
			<View style={styles.chapterItemContent}>
				<Text style={styles.chapterName} numberOfLines={1} ellipsizeMode='tail'>{item.name}</Text>
				<Text style={styles.chapterReleased}>{item.released}</Text>
			</View>
		</TouchableOpacity>
	);
});

export default function ChapterList({chapters, header, onPress}:{
    chapters: Chapter[],
    header: React.JSX.Element,
    onPress: (chapter: Chapter) => void;
}) {
    return (
        <View style={styles.chaptersContainer}>
			<FlashList
				data={chapters}
				extraData={chapters}
				removeClippedSubviews={true}
				estimatedItemSize={50}
				ListHeaderComponent={header}
				renderItem={({ item: chapter }) => (
					<RenderItem
						item={chapter}
						onPress={onPress}
					/>
				)}
			/>
		</View>
    )
}


const styles = StyleSheet.create({
	chaptersContainer: {
		marginTop: StatusBar.currentHeight,
		alignContent: 'center',
		width: '100%',
		height: '100%',
		paddingBottom: 30,
	},
	chapterItem: {
		height: 50,
		backgroundColor: '#353535',
		borderRadius: 5,
		paddingHorizontal: 10,
		paddingVertical: 15,
		marginBottom: 10,
		width: '95%',
		alignSelf: 'center',
	},
	chapterItemContent: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	chapterName: {
		color: 'white',
		fontSize: 16,
		flex: 0.5,
	},
	chapterReleased: {
		color: 'white',
		fontSize: 14,
		textAlign: 'right',
		flex: 0.5,
	},
});