import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import MainTabNavigator from "./MainTabNavigator";
import DrawerContent from "./DrawerContent";
import AuthStack from "./AuthStack";


const Drawer = createDrawerNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Drawer.Navigator
      initialRouteName="Main"
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{ headerShown: false,  drawerType: 'front'}}
    >
      <Drawer.Screen name='Main' component={MainTabNavigator} />
      <Drawer.Screen name="AuthStack" component={AuthStack} />
    </Drawer.Navigator>
  </NavigationContainer>
)

export default AppNavigator;