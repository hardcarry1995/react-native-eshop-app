import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScreenOptionsWithBack from "../components/ScreenOptionsWithBack";
import ScreenOptions from "../components/ScreenOptions";
import RequestItem from "../screens/RequestItem";

const Stack = createNativeStackNavigator();

function RequestStack() {
  return (
    <Stack.Navigator screenOptions={{ gestureHandler: false }}>
      <Stack.Screen name="RequestItem" component={RequestItem} options={ScreenOptions} />
    </Stack.Navigator>
  )
}

export default RequestStack;