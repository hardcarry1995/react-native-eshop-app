import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from '@react-native-community/async-storage';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    init();
  }, [])
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage);
    });
    return unsubscribe;
  }, []);

  const init = async () => {
    GoogleSignin.configure();
    if( await requestUserPermission()) {
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
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainDrawer' }],
      });
    }, 2000)
  }

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

export default SplashScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  }
})