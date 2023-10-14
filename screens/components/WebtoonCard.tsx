import * as React from 'react';
import { Text, StyleSheet, Image, TouchableOpacity } from 'react-native';


const WebtoonCard = ({ uri, webtoonName, onPress }: {
	uri: string,
	webtoonName: string,
	onPress: Function
}) => {

	return (
		<TouchableOpacity
			style={styles.card}
			onPress={() => { onPress() }}
		>
			<Image
				source={{ uri: uri }}
				style={styles.image}
			/>
			<Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
				{webtoonName}
			</Text>
		</TouchableOpacity>
	)
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: '#101010',
		borderRadius: 10,
		width: 140,
		alignContent: 'center',
	},	
	image: {
		width: '100%',
		aspectRatio: 9 / 16,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
	},
	title: {
		fontSize: 14,
		fontWeight: 'bold',
		textAlign: 'center',
		textAlignVertical: 'center',
		color: 'white',
		lineHeight: 18,
		padding: 5,
		height: (18 * 2) + 10,
	},
});

export default WebtoonCard;