import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TermCondition from "../screens/TermConditionScreens/TermCondition";
import WhiteHouseInteriors from "../screens/TermConditionScreens/WhiteHouseInteriors";
import RateandReview from "../screens/TermConditionScreens/RateandReview";



const Stack = createNativeStackNavigator();

function TermConditionStack() {
  return (
    <Stack.Navigator screenOptions={{ gestureHandler: false, headerShown: false }}>
      <Stack.Screen name="TermCondition" component={TermCondition} />
      <Stack.Screen name="WhiteHouseInteriors" component={WhiteHouseInteriors} />
      <Stack.Screen name="RateandReview" component={RateandReview} />
    </Stack.Navigator>
  )
}

export default TermConditionStack;