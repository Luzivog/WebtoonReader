import * as React from 'react';
import { Text, StyleSheet, Image, TouchableOpacity } from 'react-native';


const WebtoonCards = ({ uri, webtoonName, onPress }: {
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
		marginRight: 15,
		width: 140,
	},
	image: {
		width: '100%',
		aspectRatio: 9 / 16,
		borderRadius: 10,
	},
	title: {
		fontSize: 14,
		fontWeight: 'bold',
		textAlign: 'center',
		color: 'white',
		lineHeight: 20,
		padding: 5
	},
});

export default WebtoonCards;