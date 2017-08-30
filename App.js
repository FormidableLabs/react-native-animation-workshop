import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import data from './src/data';
import Card from './src/components/Card';
import Button from './src/components/Button';

export default class App extends React.Component {
  state = {
    items: data
  };
  render() {
    const item = this.state.items[0];
    return (
      <View style={styles.container}>
        <Card image={item.image} text={item.text} />
        <View style={styles.buttonBar}>
          <Button text="Nope" backgroundColor="#ff3b30" />
          <Button text="Yep" backgroundColor="#4cd964" />
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
