import React from 'react';
import { Image, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Constants from "../constants/constant";
import MainTabNavigator from "./MainTabNavigator";
import DrawerContent from "./DrawerContent";
import AuthStack from "./AuthStack";
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
import Menu from "../components/Meun";
import { textHeader, font_style } from '../components/styles';
import HeaderBackLeft from '../components/HeaderBackLeft';

const Drawer = createDrawerNavigator();

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
  drawerType: 'front'
})

const AppNavigator = () => (
  <NavigationContainer>
    <Drawer.Navigator
      initialRouteName="Main"
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={screenOptions}
    >
      <Drawer.Screen name='Main' component={MainTabNavigator} options={{ headerShown: false }} />
      <Drawer.Screen name="AuthStack" component={AuthStack} />
      <Drawer.Screen name={Constants.feed} component={FeedStack} />
      <Drawer.Screen name={Constants.edit_profile} component={ProfileStack} />
      <Drawer.Screen name={Constants.privacy_policy} component={PrivacyStack} />
      <Drawer.Screen name={Constants.term_condition} component={TermConditionStack} />
      <Drawer.Screen name={Constants.change_password} component={ChangePasswordStack} />
      <Drawer.Screen name={Constants.settings} component={SettingStack} />
      <Drawer.Screen name={Constants.my_Reviews} component={MyReviews} />
      <Drawer.Screen name={Constants.contact_us} component={CatalogueStack} />
      <Drawer.Screen name={Constants.about_us} component={AboutUs} />
      <Drawer.Screen name={Constants.incoming_request} component={IncomingRequest} />
      <Drawer.Screen name={Constants.my_request_stack} component={MyRequestStack} />
      <Drawer.Screen name={Constants.faq} component={FaqStack} />
      <Drawer.Screen name={Constants.logout} component={WorkInProgress} />
      <Drawer.Screen name={Constants.share_app} component={WorkInProgress} />
    </Drawer.Navigator>
  </NavigationContainer>
)

export default AppNavigator;