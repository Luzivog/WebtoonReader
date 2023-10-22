import { FlashList } from "@shopify/flash-list";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Chapter } from "../../utils/Webtoon";
import { StatusBarHeight } from "../../utils/config";
import { FlatList, ScrollView } from "react-native-gesture-handler";

export interface RenderItemProps {
	item: Chapter;
	onPress: (chapter: Chapter) => void;
	index?: number;
};

const RenderItem = ({ item, onPress }: RenderItemProps): JSX.Element => {
    return (
        <TouchableOpacity
            key={item.name}
            style={styles.chapterItem}
            onPress={() => onPress(item)}
        >
            <View style={styles.chapterItemContent}>
                <Text 
                    style={[
                        styles.chapterName,
                        item.released === '' ? styles.fullWidth : {}
                    ]} 
                    numberOfLines={1} 
                    ellipsizeMode='tail'
                >
                    {item.name}
                </Text>
                {item.released !== '' && (
                    <Text style={styles.chapterReleased}>{item.released}</Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

export default function ChapterList({ chapters, header, onPress, renderItem=RenderItem }: {
	chapters: Chapter[],
	header: React.JSX.Element,
	onPress: (chapter: Chapter) => void;
	renderItem?: (props: RenderItemProps) => JSX.Element;
}) {
	return (
		<View style={styles.chaptersContainer}>
		<FlashList		
			data={chapters}
			ListHeaderComponent={header}
			renderItem={({ item: chapter, index }) => (
				<View key={chapter.name}>
					{renderItem({
						item: chapter,
						index: index,
						onPress: onPress,
					})}
				</View>
			)}
			estimatedItemSize={60}
		/>
		</View>
	)
}


const styles = StyleSheet.create({
	chaptersContainer: {
		marginTop: StatusBarHeight,
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
	fullWidth: {
        flex: 1,
    },
});