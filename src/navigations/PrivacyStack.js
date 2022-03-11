import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PrivacyPolicy from "../screens/PrivacyScreens/PrivacyPolicy";
import HireProduct from "../screens/PrivacyScreens/HireProduct";
import ScreenOptionsWithBack from "../components/ScreenOptionsWithBack";
import ScreenOptions from "../components/ScreenOptions";

const Stack = createNativeStackNavigator();

function PrivacyStack() {
  return (
    <Stack.Navigator screenOptions={{ gestureHandler: false }}>
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={ScreenOptions}/>
      <Stack.Screen name="HireProduct" component={HireProduct} options={ScreenOptionsWithBack}/>
    </Stack.Navigator>
  )
}

export default PrivacyStack;