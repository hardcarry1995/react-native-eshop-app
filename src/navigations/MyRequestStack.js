import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RequestScreen from "../screens/MyRequestScreens/RequestScreen";
import RequestNew25 from "../screens/MyRequestScreens/RequestNew25";
import MarshNew26 from "../screens/MyRequestScreens/MarshNew26";
import ShowPDF from "../screens/MyRequestScreens/ShowPDF";

const Stack = createNativeStackNavigator();

function MyRequestStack() {
  return (
    <Stack.Navigator screenOptions={{ gestureHandler: false, headerShown: false }}>
      <Stack.Screen name="RequestScreen" component={RequestScreen} />
      <Stack.Screen name="RequestNew25" component={RequestNew25} />
      <Stack.Screen name="MarshNew26" component={MarshNew26} />
      <Stack.Screen name="ShowPDF" component={ShowPDF} />

    </Stack.Navigator>
  )
}

export default MyRequestStack;