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

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ gestureHandler: false }}>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: "Sign Up" }} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="SetSubscriptionPlan" component={SetSubscriptionPlan} />
      <Stack.Screen name="Companyinfo" component={CompanyInfo} />
      <Stack.Screen name="WebPayment" component={WebPayment} />
      <Stack.Screen name="PaymentFail" component={PaymentFail} />
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ title: "Forgot Password" }} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
    </Stack.Navigator>
  )
}

export default AuthStack;