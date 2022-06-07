import React from 'react'
import { Image, View } from "react-native"
import { textHeader, font_style } from './styles';
import Menu from "./Meun";

const screenOptions = ({ navigation }) => ({
  headerBackground: () => (
    <View style={{ flex: 1, backgroundColor: '#fff' }} />
  ),
  headerStyle: textHeader.header_style,
  headerTitleAlign: 'center',
  headerTitle: () => (
    <Image
      source={require('../assets/img/LoginIcon.png')}
      style={{ width: 100, height: 45 }}
      resizeMode ='contain'
    />
  ),
  headerLeft: () => <Menu navigationProps={navigation} />,
})

export default screenOptions;