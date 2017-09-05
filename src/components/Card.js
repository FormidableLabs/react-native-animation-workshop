// @flow

import React, { Component } from 'react';
import { Platform, View, Image, Text, StyleSheet, TouchableWithoutFeedback, LayoutAnimation } from 'react-native';

if (Platform.OS === 'android') {
  // $FlowFixMe
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
  image: number,
  text: string
};

const springAnimationProperties = {
  type: 'spring',
  springDamping: 0.4,
  property: 'opacity',
}

const animationConfig = {
  duration: 700,
  create: springAnimationProperties,
  update: springAnimationProperties,
  delete: springAnimationProperties,
};

class Card extends Component {
  state = {
    isExpanded: false
  };

  toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    this.setState({ isExpanded: !this.state.isExpanded });
  }

  props: Props;

  render() {
    const { isExpanded } = this.state;
    const { image, text } = this.props;

    return (
      <TouchableWithoutFeedback onPress={this.toggleExpand}>
        <View style={[ styles.card, isExpanded && styles.cardExpanded ]}>
          <Image source={image} style={[styles.image]} resizeMode="cover" />
          <View style={styles.textWrapper}>
            <Text numberOfLines={1} style={styles.text}>
              {text}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

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
  cardExpanded: {
    width: 600,
    height: 600
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
