import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Constants from "../constants/constant";
import MainTabNavigator from "./MainTabNavigator";
import DrawerContent from "./DrawerContent";
import AuthStack from "./AuthStack";
import FeedStack from "./FeedStack";
import ProfileStack from "./ProfileSack";


const Drawer = createDrawerNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Drawer.Navigator
      initialRouteName="Main"
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{ headerShown: false, drawerType: 'front', }}
    >
      <Drawer.Screen name='Main' component={MainTabNavigator} />
      <Drawer.Screen name="AuthStack" component={AuthStack} />
      <Drawer.Screen name={Constants.feed} component={FeedStack} />
      <Drawer.Screen name={Constants.edit_profile} component={ProfileStack} />
    </Drawer.Navigator>
  </NavigationContainer>
)

export default AppNavigator;