import * as React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { HomeScreenNavigationProp } from '../../navigation/stacks/HomeStack';
import Webtoon from '../../navigation/Webtoon';

const WebtoonCards = ({ navigation, webtoons }:{
    navigation: HomeScreenNavigationProp,
    webtoons: Webtoon[]
}) => {

  return (
    <View style={styles.cardContainer}>
      {webtoons.map((webtoon, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() => {
            navigation.navigate('WebtoonStack', { 
              screen: "WebtoonDetailsScreen", 
              params: {webtoon: webtoon}
            })
          }}
        >
          <Image
            source={{ uri: webtoon.imageUrl }}
            style={styles.image}
          />
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
            {webtoon.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: '#101010',
    borderRadius: 10,
    marginRight: 15,
    width: 140,
  },
  image: {
    width: '100%',
    aspectRatio: 9/16,
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