import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import MainTabNavigator from "./MainTabNavigator";
import DrawerContent from "./DrawerContent";

const Drawer = createDrawerNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Drawer.Navigator initialRouteName="Main" drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen name='Main' component={MainTabNavigator} />
    </Drawer.Navigator>
  </NavigationContainer>
)

export default AppNavigator;