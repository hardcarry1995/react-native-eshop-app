import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingScreen from "../screens/SettingScreen";
import ScreenOptionsWithBack from "../components/ScreenOptionsWithBack";
import ScreenOptions from "../components/ScreenOptions";

const Stack = createNativeStackNavigator();

function SettingStack() {
  return (
    <Stack.Navigator screenOptions={{ gestureHandler: false, headerShown: false }}>
      <Stack.Screen name="SettingScreen" component={SettingScreen} options={ScreenOptions} />
    </Stack.Navigator>
  )
}

export default SettingStack;