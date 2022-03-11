import React from 'react'
import { Image, View } from "react-native"
import { textHeader, font_style } from './styles';
import HeaderBackLeft from './HeaderBackLeft';

const ScreenOptionsWithBack = ({ navigation }) => ({
  headerBackground: () => (
    <View style={{ flex: 1, backgroundColor: '#fff' }} />
  ),
  headerStyle: textHeader.header_style,
  headerTitle: () => (
    <Image
      source={require('../assets/img/LoginIcon.png')}
      style={{ width: 100, height: 45, resizeMode: 'contain' }}
    />
  ),
  headerLeft: () => <HeaderBackLeft navigationProps={navigation} />,
})

export default ScreenOptionsWithBack