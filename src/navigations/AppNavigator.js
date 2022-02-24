import React from 'react';
import { View, Text, TouchableOpacity, Image } from "react-native";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import MainTabNavigator from "./MainTabNavigator";
import DrawerContent from "./DrawerContent";
import Menu from "../components/Meun";
import { textHeader, font_style } from '../components/styles';


const Drawer = createDrawerNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Drawer.Navigator
      initialRouteName="Main"
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        drawerType: 'front',
        headerBackground: () => (
          <View style={{ flex: 1, backgroundColor: 'white' }} />
        ),
        headerStyle: textHeader.header_style,
        headerTitle: () => (
          <Image
            source={require('../assets/img/LoginIcon.png')}
            style={{ width: 120, height: 60, resizeMode: 'contain' }}
          />
        ),
        headerLeft: () => <Menu navigationProps={navigation} />,
      })}
    >
      <Drawer.Screen name='Main' component={MainTabNavigator} />
    </Drawer.Navigator>
  </NavigationContainer>
)

export default AppNavigator;