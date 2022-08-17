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
import IncomingRequest from "../screens/IncomingRequestScreens/IncomingRequest";
import MyRequestStack from "./MyRequestStack";
import FaqStack from "./FaqStack";
import WorkInProgress from "../screens/WorkInProgress";
import ContactFrom from "../screens/ContactForm";
import MyFavorites from "../screens/MyFavorites"
import AddAddress from "../screens/CartScreens/AddAddress";
import RequestNew25 from "../screens/MyRequestScreens/RequestNew25";
import MarshNew26 from "../screens/MyRequestScreens/MarshNew26";
import IncomingRequestDetail from "../screens/IncomingRequestScreens/IncomingRequestDetail";
import IncomingRequestChat from "../screens/IncomingRequestScreens/IncomingRequestChat";
import Orders from "../screens/OrderScreens/Orders";
import Order from "../screens/OrderScreens/Order";

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

import HomeTabs from "./HomeNavigator";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Define HomeStack
const HomeStack = () => (
  <Stack.Navigator screenOptions={ScreenOptions}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen
      name="Filter"
      component={ProductDetail}
      options={({ navigation }) => ({
        headerStyle: textHeader.header_style,
        // headerRight: () => (
        //   <Image
        //     style={{ height: 22, width: 25, padding: 5, alignSelf: 'flex-end' }}
        //     source={require('../assets/share.png')}
        //     resizeMode="contain"
        //   />
        // ),
        headerLeft: () => <HeaderBackLeft navigationProps={navigation} />,
      })} />
  </Stack.Navigator>
)

// Define Product Stack
// this is same as Matches Stack from old file
const ProductStack = () => (
  <Stack.Navigator screenOptions={ScreenOptions}>
    <Stack.Screen name="Product" component={ProductScreen} />
  </Stack.Navigator>
)

// Define CategoryStack -- Large Icon 
// This is same as ChatStack from old files
const CategoryStack = () => (
  <Stack.Navigator screenOptions={ScreenOptions}>
    <Stack.Screen name="Category" component={CategoryScreen} />
  </Stack.Navigator>
)

// Define ItemCart Stack
// This is same as WorkoutStack
const CartStack = () => (
  <Stack.Navigator screenOptions={ScreenOptions}>
    <Stack.Screen name="MyCart" component={MyCartScreen} options={ScreenOptions} />
    <Stack.Screen name="Checkout" component={Checkout} options={ScreenOptionsWithBack}/>
    <Stack.Screen name="AddAddress" component={AddAddress} options={ScreenOptionsWithBack}  />
  </Stack.Navigator>
)

// Defile WishList Stack
// This is same as AlertStack from old file
const WishStack = () => (
  <Stack.Navigator screenOptions={ScreenOptions}>
    <Stack.Screen name="WishList" component={WishListScreen} />
  </Stack.Navigator>
)

// Contact Stack
const ContactStack = () => (
  <Stack.Navigator screenOptions={ScreenOptions}>
    <Stack.Screen name="ContactForm" component={ContactFrom} />
  </Stack.Navigator>
)
// My Review Staack 

const ReviewStack  = () => (
  <Stack.Navigator screenOptions={ScreenOptions}>
    <Stack.Screen name="MyReview" component={MyReviews} />
  </Stack.Navigator>
)

// MyFavorite Stack
const FavoriteStack = () => (
  <Stack.Navigator screenOptions={ScreenOptions}>
    <Stack.Screen name="MyFavorite" component={MyFavorites} />
  </Stack.Navigator>
)
// incoming RequestStack

const IncomingRequestStack = () => (
  <Stack.Navigator screenOptions={ScreenOptions}>
    <Stack.Screen name="IncomingRequest" component={IncomingRequest} />
    <Stack.Screen name="IncomingRequestDetail" component={IncomingRequestDetail} options={ScreenOptionsWithBack}/>
    <Stack.Screen name="IncomingRequestChat" component={IncomingRequestChat} options={ScreenOptionsWithBack} />
  </Stack.Navigator>
)

// Orders Stack

const OrderStack = () => (
  <Stack.Navigator screenOptions={ScreenOptions}>
    <Stack.Screen name="Orders" component={Orders} />
    <Stack.Screen name="Order" component={Order} options={ScreenOptionsWithBack} />
  </Stack.Navigator>
)

const ProductMapStack = () => (
  <Stack.Navigator screenOptions={ScreenOptions}>
    <Stack.Screen name="product_map" component={AboutUs} options={ScreenOptionsWithBack}/>
  </Stack.Navigator>
)

// Define TabBar
const TabBarNavigator = () => (
  <Tab.Navigator
    tabBar={props => <TabBar {...props} />}
    screenOptions={{ gestureEnabled: false, headerShown: false }}
  >
    <Tab.Screen name="HomeStack" component={HomeTabs} />
    <Tab.Screen name={Constants.my_request_stack} component={MyRequestStack}  />
    <Tab.Screen name="CategoryStack" component={RequestStack}  />
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
    <Tab.Screen name={Constants.about_us} component={ProductMapStack}  />
    <Tab.Screen name={Constants.incoming_request} component={IncomingRequestStack}   />
    <Tab.Screen name={Constants.faq} component={FaqStack}  />
    <Tab.Screen name={Constants.logout} component={WorkInProgress} />
    <Tab.Screen name={Constants.share_app} component={WorkInProgress}  />
    <Tab.Screen name="RequestStack" component={RequestStack}  />
    <Tab.Screen name="ContactStack" component={ContactStack}  />
    <Tab.Screen name={Constants.my_Favirity} component={FavoriteStack} />
    <Tab.Screen name="MyOrders" component={OrderStack}  />
    <Tab.Screen name="ProductStack" component={ProductStack} />
  </Tab.Navigator>
)

export default TabBarNavigator;

