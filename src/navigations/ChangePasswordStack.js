import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChangePassword from "../screens/ChangePassword";
import ScreenOptions from "../components/ScreenOptions";

const Stack = createNativeStackNavigator();

function ChangePasswordStack() {
  return (
    <Stack.Navigator screenOptions={{ gestureHandler: false }}>
      <Stack.Screen name="ChangePassword" component={ChangePassword} options={ScreenOptions} />
    </Stack.Navigator>
  )
}

export default ChangePasswordStack;