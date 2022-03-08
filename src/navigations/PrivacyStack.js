import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PrivacyPolicy from "../screens/PrivacyScreens/PrivacyPolicy";
import HireProduct from "../screens/PrivacyScreens/HireProduct";


const Stack = createNativeStackNavigator();

function PrivacyStack() {
  return (
    <Stack.Navigator screenOptions={{ gestureHandler: false, headerShown: false }}>
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="HireProduct" component={HireProduct} />
    </Stack.Navigator>
  )
}

export default PrivacyStack;