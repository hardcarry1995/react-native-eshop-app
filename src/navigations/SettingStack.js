import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingScreen from "../screens/SettingScreen";

const Stack = createNativeStackNavigator();

function SettingStack() {
  return (
    <Stack.Navigator screenOptions={{ gestureHandler: false, headerShown: false }}>
      <Stack.Screen name="SettingScreen" component={SettingScreen} />
    </Stack.Navigator>
  )
}

export default SettingStack;