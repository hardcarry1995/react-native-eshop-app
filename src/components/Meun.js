import React, { Component } from 'react';
import { Platform, TouchableOpacity, View, Image } from 'react-native';
import { textHeader } from './styles';

export default class Meun extends Component {
  render() {
    return (
      <TouchableOpacity onPress={() => { this.props.navigationProps.openDrawer(); }} style={{...textHeader.leftIcon, ...this.props.style}}>
        <Image
          source={require('./../assets/burgermenu.png')}
          style={{
            width: 21,
            height: 20,
            alignSelf: 'flex-start',
            tintColor: '#000',
          }}
        />
      </TouchableOpacity>
    );
  }
}
