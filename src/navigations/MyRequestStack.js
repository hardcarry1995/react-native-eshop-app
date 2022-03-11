import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RequestScreen from "../screens/MyRequestScreens/RequestScreen";
import RequestNew25 from "../screens/MyRequestScreens/RequestNew25";
import MarshNew26 from "../screens/MyRequestScreens/MarshNew26";
import ShowPDF from "../screens/MyRequestScreens/ShowPDF";
import ScreenOptionsWithBack from "../components/ScreenOptionsWithBack";
import ScreenOptions from "../components/ScreenOptions";

const Stack = createNativeStackNavigator();

function MyRequestStack() {
  return (
    <Stack.Navigator screenOptions={{ gestureHandler: false}}>
      <Stack.Screen name="RequestScreen" component={RequestScreen} options={ScreenOptions}/>
      <Stack.Screen name="RequestNew25" component={RequestNew25} options={ScreenOptionsWithBack}/>
      <Stack.Screen name="MarshNew26" component={MarshNew26} options={ScreenOptionsWithBack}/>
      <Stack.Screen name="ShowPDF" component={ShowPDF} options={ScreenOptionsWithBack}/>

    </Stack.Navigator>
  )
}

export default MyRequestStack;