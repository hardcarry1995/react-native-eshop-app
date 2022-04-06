import React from 'react';
import { Platform, Image, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Menu from "../components/Meun";
import { textHeader, font_style } from '../components/styles';
import HeaderBackLeft from '../components/HeaderBackLeft';
import Constants from '../constants/constant';
import FeedStack from "./FeedStack";
import ProfileStack from "./ProfileSack";
import PrivacyStack from "./PrivacyStack";
import TermConditionStack from "./TermConditionStack";
import ChangePasswordStack from "./ChangePasswordStack";
import SettingStack from "./SettingStack";
import MyReviews from "../screens/MyReviews";
import CatalogueStack from "./CatalogueStack";
import AboutUs from "../screens/AboutUs";
import IncomingRequest from "../screens/IncomingRequest";
import MyRequestStack from "./MyRequestStack";
import FaqStack from "./FaqStack";
import WorkInProgress from "../screens/WorkInProgress";
import ContactFrom from "../screens/ContactForm";

import TabBar from "./BottomTabBar";
// HomeStack Screens
import HomeScreen from "../screens/HomeScreen";
import ProductDetail from "../screens/ProductDetail";
// ProductStack screens
import ProductScreen from "../screens/ProductScreen";

// CategoryStack Screens
import CategoryScreen from "../screens/CategoryScreen";

// CartItem Stack Screens 
import MyCartScreen from '../screens/CartScreens/MyCartScreen';
import Checkout from "../screens/CartScreens/Checkout";

// WishList Stack Screens
import WishListScreen from '../screens/WishListScreen';
import ScreenOptions from "../components/ScreenOptions";
import ScreenOptionsWithBack from "../components/ScreenOptionsWithBack";
import RequestStack from "./RequestStack";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = ({ navigation }) => ({
  headerBackground: () => (
    <View style={{ flex: 1, backgroundColor: '#fff' }} />
  ),
  headerStyle: textHeader.header_style,
  headerTitle: () => (
    <Image
      source={require('../assets/img/LoginIcon.png')}
      style={{ width: 100, height: 45, resizeMode: 'contain' }}
    />
  ),
  headerLeft: () => <Menu navigationProps={navigation} />,
})
// Define HomeStack
const HomeStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen
      name="Filter"
      component={ProductDetail}
      options={({ navigation }) => ({
        headerStyle: textHeader.header_style,
        headerRight: () => (
          <Image
            style={{ height: 22, width: 25, padding: 5, resizeMode: 'center', alignSelf: 'flex-end' }}
            source={require('../assets/share.png')}
          />
        ),
        headerLeft: () => <HeaderBackLeft navigationProps={navigation} />,
      })} />
  </Stack.Navigator>
)

// Define Product Stack
// this is same as Matches Stack from old file
const ProductStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="Product" component={ProductScreen} />
  </Stack.Navigator>
)

// Define CategoryStack -- Large Icon 
// This is same as ChatStack from old files
const CategoryStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="Category" component={CategoryScreen} />
  </Stack.Navigator>
)

// Define ItemCart Stack
// This is same as WorkoutStack
const CartStack = () => (
  <Stack.Navigator >
    <Stack.Screen name="MyCart" component={MyCartScreen} options={screenOptions} />
    <Stack.Screen name="Checkout" component={Checkout} options={ScreenOptionsWithBack}/>
  </Stack.Navigator>
)

// Defile WishList Stack
// This is same as AlertStack from old file
const WishStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="WishList" component={WishListScreen} />
  </Stack.Navigator>
)

// Contact Stack
const ContactStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="ContactForm" component={ContactFrom} />
  </Stack.Navigator>
)
// My Review Staack 

const ReviewStack  = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="MyReview" component={MyReviews} />
  </Stack.Navigator>
)

// Define TabBar
const TabBarNavigator = () => (
  <Tab.Navigator
    tabBar={props => <TabBar {...props} />}
    screenOptions={{ gestureEnabled: false, headerShown: false }}
  >
    <Tab.Screen name="HomeStack" component={HomeStack} />
    <Tab.Screen name="ProductStack" component={ProductStack} />
    <Tab.Screen name="CategoryStack" component={CategoryStack}  />
    <Tab.Screen name="CartStack" component={CartStack}  />
    <Tab.Screen name="WishStack" component={WishStack}  />
    <Tab.Screen name={Constants.feed} component={FeedStack}  />
    <Tab.Screen name={Constants.edit_profile} component={ProfileStack} />
    <Tab.Screen name={Constants.privacy_policy} component={PrivacyStack}  />
    <Tab.Screen name={Constants.term_condition} component={TermConditionStack}  />
    <Tab.Screen name={Constants.change_password} component={ChangePasswordStack}  />
    <Tab.Screen name={Constants.settings} component={SettingStack}  />
    <Tab.Screen name={Constants.my_Reviews} component={ReviewStack}  />
    <Tab.Screen name={Constants.contact_us} component={CatalogueStack}  />
    <Tab.Screen name={Constants.about_us} component={AboutUs}  />
    <Tab.Screen name={Constants.incoming_request} component={IncomingRequest}   />
    <Tab.Screen name={Constants.my_request_stack} component={MyRequestStack}  />
    <Tab.Screen name={Constants.faq} component={FaqStack}  />
    <Tab.Screen name={Constants.logout} component={WorkInProgress} />
    <Tab.Screen name={Constants.share_app} component={WorkInProgress}  />
    <Tab.Screen name="RequestStack" component={RequestStack}  />
    <Tab.Screen name="ContactStack" component={ContactStack}  />
  </Tab.Navigator>
)

export default TabBarNavigator;

