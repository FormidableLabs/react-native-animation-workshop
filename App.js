import React from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import data from './src/data';
import Card from './src/components/Card';
import Button from './src/components/Button';

const SWIPE_DISTANCE = Dimensions.get('window').width;

export default class App extends React.Component {
  state = {
    items: data
  };

  position = new Animated.Value(0);

  nopePressed = () => {
    Animated.timing(this.position, {
      toValue: -1
    }).start();
  };

  yepPressed = () => {
    Animated.timing(this.position, {
      toValue: 1
    }).start();
  };

  render() {
    const item = this.state.items[0];

    const translateX = this.position.interpolate({
      inputRange: [-1, +1],
      outputRange: [-SWIPE_DISTANCE, SWIPE_DISTANCE]
    });

    const rotate = this.position.interpolate({
      inputRange: [-1, +1],
      outputRange: ['-30deg', '30deg']
    });

    const animatedStyle = {
      transform: [{ translateX }, { rotate }]
    };

    return (
      <View style={styles.container}>
        <Animated.View style={animatedStyle}>
          <Card image={item.image} text={item.text} />
        </Animated.View>
        <View style={styles.buttonBar}>
          <Button onPress={this.nopePressed} text="Nope" backgroundColor="#ff3b30" />
          <Button onPress={this.yepPressed} text="Yep" backgroundColor="#4cd964" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(242, 245, 253)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonBar: {
    alignItems: 'stretch',
    flexDirection: 'row',
    position: 'absolute',
    padding: 5,
    bottom: 0,
    left: 0,
    right: 0,
    height: 75
  }
});
