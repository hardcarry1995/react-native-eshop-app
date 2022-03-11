import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from "../screens/ProfileScreens/ProfileScreen";
import ScreenOptionsWithBack from "../components/ScreenOptionsWithBack";
import ScreenOptions from "../components/ScreenOptions";

const Stack = createNativeStackNavigator();

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ gestureHandler: false}}>
      <Stack.Screen name="Profile" component={ProfileScreen} options={ScreenOptions}  />
    </Stack.Navigator>
  )
}

export default ProfileStack;