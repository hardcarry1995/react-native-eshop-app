import React, {Component} from 'react';
import {Platform, TouchableOpacity, View, Image} from 'react-native';
import DrawerContent from '../navigation/DrawerContent';
export default class HeaderLeft extends Component {
  toggleDrawer = () => {
    this.props.navigationProps.toggleDrawer('DrawerContent');
  };
  render() {
    return (
      <View
        style={{
          justifyContent: 'center',
        }}>
        {/* <TouchableOpacity
          onPress={this.toggleDrawer.bind(this)}
          activeOpacity={0.6}
          style={{ width: 32, height: 32, paddingLeft: 16, paddingEnd: 16, justifyContent: 'center' }}
          >

          <Image style={{ width: 20, height: 20, resizeMode: 'contain' ,tintColor:'#000'}} source={require('../assets/images/menu_button_3x.png')} />
        </TouchableOpacity> */}
      </View>
    );
  }
}
