import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScreenOptionsWithBack from "../components/ScreenOptionsWithBack";
import ScreenOptions from "../components/ScreenOptions";
import RequestItem from "../screens/RequestItem";
import CreateFeed from "../screens/FeedScreens/CreateFeed";
import Request24 from "../screens/FeedScreens/Request24";
import RequestNew25 from "../screens/MyRequestScreens/RequestNew25";

const Stack = createNativeStackNavigator();

function RequestStack() {
  return (
    <Stack.Navigator screenOptions={{ gestureHandler: false }}>
      <Stack.Screen name="RequestItem" component={RequestItem} options={ScreenOptions} />
      <Stack.Screen name="CreateFeed" component={CreateFeed} options={ScreenOptionsWithBack}  />
      <Stack.Screen name="Request24" component={Request24} options={ScreenOptionsWithBack} />
      <Stack.Screen name="RequestNew25" component={RequestNew25} options={ScreenOptionsWithBack}/>
    </Stack.Navigator>
  )
}

export default RequestStack;