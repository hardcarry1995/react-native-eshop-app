import React from 'react';
import { Platform, Image, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Menu from "../components/Meun";
import { textHeader, font_style } from '../components/styles';
import HeaderBackLeft from '../components/HeaderBackLeft';

import TabBar from "./BottomTabBar";
// HomeStack Screens
import HomeScreen from "../screens/HomeScreen";
import Filter from "../screens/Filter";
// ProductStack screens
import ProductScreen from "../screens/ProductScreen";

// CategoryStack Screens
import CategoryScreen from "../screens/CategoryScreen";

// CartItem Stack Screens 
import MyCartScreen from '../screens/MyCartScreen';

// WishList Stack Screens
import WishListScreen from '../screens/WishListScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = ({ navigation }) => ({
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
  headerLeft: () => <Menu navigationProps={navigation} />,
})
// Define HomeStack
const HomeStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen
      name="Filter"
      component={Filter}
      options={({ navigation }) => ({
        headerStyle: textHeader.header_style,
        headerRight: () => (
          <Image
            style={{ height: 22, width: 25, padding: 5, resizeMode: 'center', alignSelf: 'flex-end' }}
            source={require('../assets/share.png')}
          />
        ),
        headerLeft: () => <HeaderBackLeft navigationProps={navigation} />,
      })} />
  </Stack.Navigator>
)

// Define Product Stack
// this is same as Matches Stack from old file
const ProductStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="Product" component={ProductScreen} />
  </Stack.Navigator>
)

// Define CategoryStack -- Large Icon 
// This is same as ChatStack from old files
const CategoryStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="Category" component={CategoryScreen} />
  </Stack.Navigator>
)

// Define ItemCart Stack
// This is same as WorkoutStack
const CartStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="MyCart" component={MyCartScreen} />
  </Stack.Navigator>
)

// Defile WishList Stack
// This is same as AlertStack from old file
const WishStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="WishList" component={WishListScreen} />
  </Stack.Navigator>
)

// Define TabBar
const TabBarNavigator = () => (
  <Tab.Navigator
    tabBar={props => <TabBar {...props} />}
    screenOptions={{ headerShown: false, gestureEnabled: false }}
  >
    <Tab.Screen name="HomeStack" component={HomeStack} />
    <Tab.Screen name="ProductStack" component={ProductStack} />
    <Tab.Screen name="CategoryStack" component={CategoryStack} />
    <Tab.Screen name="CartStack" component={CartStack} />
    <Tab.Screen name="WishStack" component={WishStack} />
  </Tab.Navigator>
)

export default TabBarNavigator;

