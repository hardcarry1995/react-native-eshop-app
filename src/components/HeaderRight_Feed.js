import React, {Component} from 'react';
import {Platform, TouchableOpacity, View, Image} from 'react-native';

export default class HeaderRight_Feed extends Component {
  render() {
    return (
      <View
        style={{
          justifyContent: 'center',
        }}>
        {/* <TouchableOpacity
          onPress={this.props.hh}
          activeOpacity={0.6}
          style={{ width: 32, height: 32, paddingRight: 16, paddingEnd: 16, justifyContent: 'center' }}>
          <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../assets/images/OwnFeed.png')} />
        </TouchableOpacity> */}
      </View>
    );
  }
}
