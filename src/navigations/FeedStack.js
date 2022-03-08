import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Feed from "../screens/FeedScreens/Feed";
import RequestItem from "../screens/FeedScreens/RequestItem";
import CategoryScreen from "../screens/CategoryScreen";
import HomeScreenCat from "../screens/FeedScreens/HomeScreenCat";
import Request25 from "../screens/FeedScreens/Request25";
import Request24 from "../screens/FeedScreens/Request24";
import Category20 from "../screens/FeedScreens/Category20";
import QRCode from "../screens/FeedScreens/QRCode";
import MyRequest from "../screens/FeedScreens/MyRequest";
import Marsh26 from "../screens/FeedScreens/Marsh26";
import MyFeed from "../screens/FeedScreens/MyFeed";
import CreateFeed from "../screens/FeedScreens/CreateFeed";
import VideoRecord from "../components/VideoRecord";
import FeedDetails from "../screens/FeedScreens/FeedDetails";
import FeedComments from "../screens/FeedScreens/FeedComments";
import EditFeed from "../screens/FeedScreens/EditFeed";


const Stack = createNativeStackNavigator();

function FeedStack() {
  return (
    <Stack.Navigator screenOptions={{ gestureHandler: false, headerShown: false }}>
      <Stack.Screen name="ChatItem" component={CategoryScreen} />
      <Stack.Screen name="RequestItem" component={RequestItem} />
      <Stack.Screen name="Feed" component={Feed} />
      <Stack.Screen name="HomeWithParam" component={HomeScreenCat} />
      <Stack.Screen name="Request25" component={Request25} />
      <Stack.Screen name="Request24" component={Request24} />
      <Stack.Screen name="Categories20" component={Category20} />
      <Stack.Screen name="QRCode" component={QRCode} />
      <Stack.Screen name="MyRequest" component={MyRequest} />
      <Stack.Screen name="Marsh26" component={Marsh26} />
      <Stack.Screen name="MyFeed" component={MyFeed} />
      <Stack.Screen name="CreateFeed" component={CreateFeed} />
      <Stack.Screen name="VideoRecord" component={VideoRecord} />
      <Stack.Screen name="FeedDetails" component={FeedDetails} />
      <Stack.Screen name="FeedComments" component={FeedComments} />
      <Stack.Screen name="EditFeed" component={EditFeed} />
    </Stack.Navigator>
  )
}

export default FeedStack;