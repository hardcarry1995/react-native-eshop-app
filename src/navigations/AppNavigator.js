import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import MainTabNavigator from "./MainTabNavigator";
import DrawerContent from "./DrawerContent";
import AuthStack from "./AuthStack";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';

const Stack = createStackNavigator();

const Drawer = createDrawerNavigator();

const DrawerStack = () => (
  <Drawer.Navigator
    initialRouteName="Main"
    drawerContent={(props) => <DrawerContent {...props} />}
    screenOptions={{ headerShown: false,  drawerType: 'front'}}
  >
    <Drawer.Screen name='Main' component={MainTabNavigator} />
    <Drawer.Screen name="AuthStack" component={AuthStack} />
  </Drawer.Navigator>
)

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false, gestureHandler: false}}>
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="MainDrawer" component={DrawerStack} />
    </Stack.Navigator>
  </NavigationContainer>
)

export default AppNavigator;