import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FaqScreen from "../screens/FaqScreens/FaqScreen";
import Special from "../screens/FaqScreens/Special";
import CatalogueNew from "../screens/CatalogueScreens/CatalogueNew";

const Stack = createNativeStackNavigator();

function FaqStack() {
  return (
    <Stack.Navigator screenOptions={{ gestureHandler: false, headerShown: false }}>
      <Stack.Screen name="FaqScreen" component={FaqScreen} />
      <Stack.Screen name="Special" component={Special} />
      <Stack.Screen name="Catalogue36" component={CatalogueNew} />
    </Stack.Navigator>
  )
}

export default FaqStack;