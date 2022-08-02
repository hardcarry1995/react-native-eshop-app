import React from "react";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProductScreen from "../screens/ProductScreen";
import SettingScreen from "../screens/SettingScreen";
import PrivacyPolicy from "../screens/HireScreens/PrivacyPolicy";
import HireProduct from "../screens/HireScreens/HireProduct";
import MyBidScreen from "../screens/MyBidScreen";
import ScreenOptions from "../components/ScreenOptions";
import ProductDetail from "../screens/ProductDetail";
import ScreenOptionsWithBack from "../components/ScreenOptionsWithBack";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, TouchableOpacity } from 'react-native';

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

function MyTabBar({ state, descriptors, navigation, position }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, backgroundColor: isFocused ? "red" : '#fff', height : 45, justifyContent: 'center', alignItems: 'center'}}
            key={state.routes.key}
          >
            <Text style={{ color: isFocused ? "#fff" : "#888", fontWeight: isFocused ? "700" : "600", fontSize: isFocused ? 18 : 16}}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}


function Tabs() {
  return (
    <Tab.Navigator screenOptions={ScreenOptions} tabBar={props => <MyTabBar {...props} />}>
      <Tab.Screen name="All" component={HomeScreen} />
      <Tab.Screen name="Buy" component={ProductScreen} />
      <Tab.Screen name="Bid" component={SettingScreen} />
      <Tab.Screen name="Hire" component={PrivacyPolicy} />
    </Tab.Navigator>
  );
} 

const HomeTabs = () => (
  <Stack.Navigator screenOptions={ScreenOptions}>
    <Stack.Screen name="Home" component={Tabs} />
    <Stack.Screen
      name="Filter"
      component={ProductDetail}
      options={ScreenOptionsWithBack}
    />
    <Stack.Screen name="HireProduct" component={HireProduct}  />
    <Stack.Screen name="MyBid" component={MyBidScreen} />
  </Stack.Navigator>
)


export default HomeTabs;