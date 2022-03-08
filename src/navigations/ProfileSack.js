import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from "../screens/ProfileScreens/ProfileScreen";

const Stack = createNativeStackNavigator();

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ gestureHandler: false, headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  )
}

export default ProfileStack;