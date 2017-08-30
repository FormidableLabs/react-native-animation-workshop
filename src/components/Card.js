// @flow

import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

type Props = {
  image: number,
  text: string
};

const Card = ({ image, text }: Props) => (
  <View style={styles.card}>
    <Image source={image} style={[styles.image]} resizeMode="cover" />
    <View style={styles.text}>
      <Text>{text}</Text>
    </View>
  </View>
);

export default Card;

const styles = StyleSheet.create({
  card: {
    width: 300,
    height: 300,
    borderRadius: 7,
    shadowColor: '#000',
    shadowOpacity: 0.17,
    shadowOffset: { x: 0, y: 0 },
    shadowRadius: 20,
    elevation: 3
  },
  text: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 5
  },
  image: {
    width: null,
    height: null,
    borderRadius: 2,
    flex: 3
  }
});
