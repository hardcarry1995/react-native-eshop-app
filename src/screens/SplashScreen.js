import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image, Platform} from 'react-native'
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from '@react-native-community/async-storage';
import { getBrand, getManufacturer } from 'react-native-device-info';
import { GUEST_LOGIN, SUB_CATEGORY, GET_SHOPPING_CART } from '../constants/queries';
import { mainCategoryId } from "../constants/categories";
import client from '../constants/client';
import { bearerToken } from '../constants/utils';
import { connect } from 'react-redux';


const SplashScreen = ({ navigation, addProductToCart }) => {

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }

    return enabled;
  }

  const checkLogin = async () => {
    try{
      let token = await AsyncStorage.getItem('userToken');
      let IsLogin = await AsyncStorage.getItem('IsLogin');
      console.log(token);
      if (token == '' || token == null) {
        token = await getQuestToken();
      } 
  
      const categoryQueryResult = await client
                                          .query({
                                            query: SUB_CATEGORY,
                                            context: {
                                              headers: {
                                                Authorization: `Bearer ${token}`,
                                                'Content-Length': 0,
                                              },
                                            },
                                            variables: {
                                              id: mainCategoryId,
                                            },
                                          });
      const subCategoryIds = categoryQueryResult.data.getMstCategoryByParentId.result.map(category => category.categoryId);
      await AsyncStorage.setItem("categories", subCategoryIds.join(","));
    } catch (e){
      console.log(e);
    }
    
  }

  getQuestToken = async () => {
    const result = await client
      .query({
        query: GUEST_LOGIN,
        context: {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            'Content-Length': 0,
          },
        },
      });
    await AsyncStorage.setItem('userToken', result.data.guestLogin.result.value);

    return result.data.guestLogin.result.value;
  }



  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage);
    });
    return unsubscribe;
  }, []);

  const init = async () => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/user.birthday.read'],
      webClientId:
        '232834789917-0i6u709vc27u2bo5idli0hgv1v9jhcp9.apps.googleusercontent.com',
      offlineAccess: true, // if you want to access Google API on behalf
      hostedDomain: '',
      forceConsentPrompt: true,
    });
    const deviceBrand = getBrand();
    if(deviceBrand != "HUAWEI" && await requestUserPermission()){
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        AsyncStorage.setItem('fcm_token', fcmToken);
      } else {
        console.log('fcm_token', fcmToken);
      }
      messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
          'Notification caused app to open from background state:',
          remoteMessage.notification,
        );
        // navigation.navigate(remoteMessage.data.type);
      });
      // Check whether an initial notification is available
      messaging()
        .getInitialNotification()
        .then(remoteMessage => {
          if (remoteMessage) {
            console.log(
              'Notification caused app to open from quit state:',
              remoteMessage.notification,
            );
            // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
          }
        });
    }

    await checkLogin();

    navigation.reset({
      index: 0,
      routes: [{ name: 'MainDrawer' }],
    });
  }
  useEffect(() => {
    init();
  }, []);





  return (
    <View style={styles.container}>
      <Image  
        source={require("../assets/logos/2.gif")}
        style={{ width : 350, height : 200 }}
        resizeMode="contain"
      />
    </View>
  )
}

const mapDispatchToProps = dispatch => ({
  addProductToCart : value => dispatch({
    type: "GET_CARTS_ITEMS",
    payload : value
  })
});

export default connect(null, mapDispatchToProps)(SplashScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  }
})