import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ContactUs from "../screens/CatalogueScreens/ContactUs";
import CatalogueNew from "../screens/CatalogueScreens/CatalogueNew";
import RateandReview from "../screens/TermConditionScreens/RateandReview";

const Stack = createNativeStackNavigator();

function CatalogueStack() {
  return (
    <Stack.Navigator screenOptions={{ gestureHandler: false, headerShown: false }}>
      <Stack.Screen name="ContactUs" component={ContactUs} />
      <Stack.Screen name="CatalogueNew" component={CatalogueNew} />
      <Stack.Screen name="RateScreen" component={RateandReview} />

    </Stack.Navigator>
  )
}

export default CatalogueStack;