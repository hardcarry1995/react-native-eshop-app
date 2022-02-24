import React from 'react';
import { SafeAreaView, StatusBar, Platform, StyleSheet, View } from 'react-native';
import { ApolloProvider } from '@apollo/client';
import AsyncStorage from '@react-native-community/async-storage';
import { NativeBaseProvider } from 'native-base';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import client from './src/constants/client';
import { MenuProvider } from 'react-native-popup-menu';
import AppNavigator from './src/navigations/AppNavigator';

function App() {
  return (
    <ApolloProvider client={client}>
      <NativeBaseProvider>
        <Provider store={store}>
          <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar backgroundColor={'#FE5665'} barStyle="light-content" />
            <MenuProvider>
              <AppNavigator />
            </MenuProvider>
          </View>
        </Provider>
      </NativeBaseProvider>
    </ApolloProvider>
  );
};


export default App;
