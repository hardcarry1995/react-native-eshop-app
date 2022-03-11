import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FaqScreen from "../screens/FaqScreens/FaqScreen";
import Special from "../screens/FaqScreens/Special";
import CatalogueNew from "../screens/CatalogueScreens/CatalogueNew";
import ScreenOptionsWithBack from "../components/ScreenOptionsWithBack";
import ScreenOptions from "../components/ScreenOptions";

const Stack = createNativeStackNavigator();

function FaqStack() {
  return (
    <Stack.Navigator screenOptions={{ gestureHandler: false }}>
      <Stack.Screen name="FaqScreen" component={FaqScreen} options={ScreenOptions} />
      <Stack.Screen name="Special" component={Special} options={ScreenOptionsWithBack} />
      <Stack.Screen name="Catalogue36" component={CatalogueNew} options={ScreenOptionsWithBack} />
    </Stack.Navigator>
  )
}

export default FaqStack;