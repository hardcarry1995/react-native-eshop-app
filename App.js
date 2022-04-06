import React from 'react';
import { SafeAreaView, StatusBar, Platform, StyleSheet, View } from 'react-native';
import { ApolloProvider } from '@apollo/client';
import AsyncStorage from '@react-native-community/async-storage';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import client from './src/constants/client';
import { MenuProvider } from 'react-native-popup-menu';
import AppNavigator from './src/navigations/AppNavigator';
import Toast from 'react-native-toast-message';

function App() {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <StatusBar backgroundColor={'#FE5665'} barStyle="light-content" />
          <MenuProvider>
            <AppNavigator />
          </MenuProvider>
        </View>
      </Provider>
      <Toast />
    </ApolloProvider>
  );
};


export default App;
