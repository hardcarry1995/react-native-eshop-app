import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TermCondition from "../screens/FindBusiness/TermCondition";
import WhiteHouseInteriors from "../screens/FindBusiness/WhiteHouseInteriors";
import RateandReview from "../screens/FindBusiness/RateandReview";
import ScreenOptionsWithBack from "../components/ScreenOptionsWithBack";
import ScreenOptions from "../components/ScreenOptions";


const Stack = createNativeStackNavigator();

function TermConditionStack() {
  return (
    <Stack.Navigator screenOptions={{ gestureHandler: false }}>
      <Stack.Screen name="TermCondition" component={TermCondition} options={ScreenOptions}/>
      <Stack.Screen name="WhiteHouseInteriors" component={WhiteHouseInteriors} options={ScreenOptionsWithBack} />
      <Stack.Screen name="RateandReview" component={RateandReview} options={ScreenOptionsWithBack}/>
    </Stack.Navigator>
  )
}

export default TermConditionStack;