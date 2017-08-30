// @flow

import React from 'react';
import {
  Platform,
  TouchableOpacity,
  TouchableNativeFeedback,
  Text,
  View,
  StyleSheet
} from 'react-native';

type Props = {
  text: string,
  onPress: () => void,
  textColor?: string,
  backgroundColor?: string
};

const Touchable = Platform.select({
  ios: TouchableOpacity,
  android: TouchableNativeFeedback
});
const Button = ({ text, textColor, backgroundColor, onPress }: Props) => (
  <Touchable onPress={onPress} style={styles.touchable}>
    <View style={[styles.button, { backgroundColor }]}>
      <Text style={[styles.text, { color: textColor }]}>{text}</Text>
    </View>
  </Touchable>
);

Button.defaultProps = {
  textColor: 'white',
  backgroundColor: '#ccc'
};

export default Button;

const styles = StyleSheet.create({
  touchable: {
    flex: 1
  },
  button: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    margin: 5
  },
  text: {
    fontWeight: 'bold',
    fontSize: 18
  }
});
