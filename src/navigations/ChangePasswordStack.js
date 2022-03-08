import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChangePassword from "../screens/ChangePassword";

const Stack = createNativeStackNavigator();

function ChangePasswordStack() {
  return (
    <Stack.Navigator screenOptions={{ gestureHandler: false, headerShown: false }}>
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
    </Stack.Navigator>
  )
}

export default ChangePasswordStack;