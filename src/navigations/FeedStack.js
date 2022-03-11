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
import ScreenOptionsWithBack from "../components/ScreenOptionsWithBack";
import ScreenOptions from "../components/ScreenOptions";

const Stack = createNativeStackNavigator();

function FeedStack() {
  return (
    <Stack.Navigator screenOptions={{ gestureHandler: false }}>
      <Stack.Screen name="ChatItem" component={CategoryScreen} options={ScreenOptions} />
      <Stack.Screen name="RequestItem" component={RequestItem} options={ScreenOptionsWithBack} />
      <Stack.Screen name="Feed" component={Feed} options={ScreenOptionsWithBack} />
      <Stack.Screen name="HomeWithParam" component={HomeScreenCat} options={ScreenOptionsWithBack} />
      <Stack.Screen name="Request25" component={Request25} options={ScreenOptionsWithBack} />
      <Stack.Screen name="Request24" component={Request24} options={ScreenOptionsWithBack} />
      <Stack.Screen name="Categories20" component={Category20} options={ScreenOptionsWithBack} />
      <Stack.Screen name="QRCode" component={QRCode} options={ScreenOptionsWithBack}  />
      <Stack.Screen name="MyRequest" component={MyRequest} options={ScreenOptionsWithBack} />
      <Stack.Screen name="Marsh26" component={Marsh26} options={ScreenOptionsWithBack} />
      <Stack.Screen name="MyFeed" component={MyFeed} options={ScreenOptionsWithBack} />
      <Stack.Screen name="CreateFeed" component={CreateFeed} options={ScreenOptionsWithBack} />
      <Stack.Screen name="VideoRecord" component={VideoRecord} options={ScreenOptionsWithBack} />
      <Stack.Screen name="FeedDetails" component={FeedDetails} options={ScreenOptionsWithBack} />
      <Stack.Screen name="FeedComments" component={FeedComments} options={ScreenOptionsWithBack} />
      <Stack.Screen name="EditFeed" component={EditFeed} options={ScreenOptionsWithBack} />
    </Stack.Navigator>
  )
}

export default FeedStack;