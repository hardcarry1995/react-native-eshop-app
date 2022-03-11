import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ContactUs from "../screens/CatalogueScreens/ContactUs";
import CatalogueNew from "../screens/CatalogueScreens/CatalogueNew";
import RateandReview from "../screens/TermConditionScreens/RateandReview";
import ScreenOptionsWithBack from "../components/ScreenOptionsWithBack";
import ScreenOptions from "../components/ScreenOptions";

const Stack = createNativeStackNavigator();

function CatalogueStack() {
  return (
    <Stack.Navigator screenOptions={{ gestureHandler: false }}>
      <Stack.Screen name="ContactUs" component={ContactUs} options={ScreenOptions}/>
      <Stack.Screen name="CatalogueNew" component={CatalogueNew} options={ScreenOptionsWithBack}/>
      <Stack.Screen name="RateScreen" component={RateandReview} options={ScreenOptionsWithBack} />
    </Stack.Navigator>
  )
}

export default CatalogueStack;