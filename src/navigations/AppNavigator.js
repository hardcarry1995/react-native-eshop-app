import React from 'react';
import { View, Text, TouchableOpacity, Image } from "react-native";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import MainTabNavigator from "./MainTabNavigator";
import DrawerContent from "./DrawerContent";



const Drawer = createDrawerNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Drawer.Navigator
      initialRouteName="Main"
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{ headerShown: false, drawerType: 'front', }}
    >
      <Drawer.Screen name='Main' component={MainTabNavigator} />
    </Drawer.Navigator>
  </NavigationContainer>
)

export default AppNavigator;