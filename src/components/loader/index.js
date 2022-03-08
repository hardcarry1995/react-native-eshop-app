/**
 * import react-native packages required for Loader @class
 */
import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import styles from './LoaderStyle';

export default class Loader extends React.Component {
  render() {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          alignContent: 'center',
          alignSelf: 'center',
          flex: 1,
        }}>
        <ActivityIndicator
          size="large"
          style={{
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          color="#FE5665"
        />
      </View>
    );
  }
}
