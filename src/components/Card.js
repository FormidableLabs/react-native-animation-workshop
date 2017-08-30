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
    <View style={styles.textWrapper}>
      <Text numberOfLines={1} style={styles.text}>
        {text}
      </Text>
    </View>
  </View>
);

export default Card;

const styles = StyleSheet.create({
  card: {
    width: 300,
    height: 300,
    backgroundColor: 'white',
    overflow: 'hidden',
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd'
  },
  textWrapper: {
    flex: 1,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    textAlign: 'center',
    fontSize: 18
  },
  image: {
    width: null,
    height: null,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    flex: 4
  }
});
