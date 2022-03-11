import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from "../screens/AuthScreens/LoginScreen";
import SignUpScreen from '../screens/AuthScreens/SignUpScreen';
import ForgotPassword from '../screens/AuthScreens/ForgotPassword';
import CompanyInfo from '../screens/AuthScreens/CompanyInfo';
import PaymentFail from '../screens/AuthScreens/PaymentFail';
import PaymentSuccess from '../screens/AuthScreens/PaymentSuccess';
import ProfileScreen from '../screens/AuthScreens/ProfileScreen';
import ResetPassword from '../screens/AuthScreens/ResetPassword';
import SetSubscriptionPlan from '../screens/AuthScreens/SetSubscriptionPlan';
import WebPayment from '../screens/AuthScreens/WebPayment';
import ScreenOptionsWithBack from "../components/ScreenOptionsWithBack";
import ScreenOptions from "../components/ScreenOptions";

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{gestureHandler: false }}>
      <Stack.Screen name="Login" component={LoginScreen} options={ScreenOptions}/>
      <Stack.Screen name="SignUp" component={SignUpScreen} options={ScreenOptionsWithBack} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={ScreenOptionsWithBack} />
      <Stack.Screen name="SetSubscriptionPlan" component={SetSubscriptionPlan} options={ScreenOptionsWithBack} />
      <Stack.Screen name="Companyinfo" component={CompanyInfo} options={ScreenOptionsWithBack}/>
      <Stack.Screen name="WebPayment" component={WebPayment} options={ScreenOptionsWithBack}/>
      <Stack.Screen name="PaymentFail" component={PaymentFail} options={ScreenOptionsWithBack}/>
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} options={ScreenOptionsWithBack}/>
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={ScreenOptionsWithBack} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} options={ScreenOptionsWithBack}/>
    </Stack.Navigator>
  )
}

export default AuthStack;