import React from 'react';
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


const Drawer = createDrawerNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Drawer.Navigator
      initialRouteName="Main"
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{ headerShown: false, drawerType: 'front', }}
    >
      <Drawer.Screen name='Main' component={MainTabNavigator} />
      <Drawer.Screen name="AuthStack" component={AuthStack} />
      <Drawer.Screen name={Constants.feed} component={FeedStack} />
      <Drawer.Screen name={Constants.edit_profile} component={ProfileStack} />
      <Drawer.Screen name={Constants.privacy_policy} component={PrivacyStack} />
      <Drawer.Screen name={Constants.term_condition} component={TermConditionStack} />
      <Drawer.Screen name={Constants.change_password} component={ChangePasswordStack} />
      <Drawer.Screen name={Constants.settings} component={SettingStack} />
      <Drawer.Screen name={Constants.my_Reviews} component={MyReviews} />
      <Drawer.Screen name={Constants.contact_us} component={CatalogueStack} />

    </Drawer.Navigator>
  </NavigationContainer>
)

export default AppNavigator;