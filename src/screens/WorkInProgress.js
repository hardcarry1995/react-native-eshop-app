import React from 'react';
import {
  ScrollView,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Colors from '../constants/colors';

export default class WorkInProgress extends React.Component {

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView
          enableAutomaticScroll
          enableOnAndroid
          resetScrollToCoords={{ x: 0, y: 0 }}
          contentContainerStyle={{ flex: 1 }}
          scrollEnabled={true}
          keyboardShouldPersistTaps="handled">
          <ScrollView />
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  loginScreenButton: {
    marginTop: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: Colors.lighter_gray,
    borderRadius: 50,
    width: '100%',
    height: 46,
    justifyContent: 'center',
  },

  loginText: {
    color: Colors.gray_shade_new,
    textAlign: 'center',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 14,
  },
  header: {
    padding: 10,
    alignItems: 'center',
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 110 / 2,
    borderWidth: 2,
    borderColor: Colors.lighter_gray,
    marginBottom: 10,
  },
  sign_in_txt: {
    color: Colors.white_color,
    fontSize: 26,
  },
  cross_icon_view: {
    width: 32,
    height: 32,
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 50,
    backgroundColor: 'white',
    shadowOffset: { width: 1, height: 1 },
    shadowColor: 'black',
    shadowOpacity: 0.4,

    elevation: 10,

    marginTop: 90,
    marginLeft: 60,
    left: 150,
    top: 0,
    zIndex: 10,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  bottom_view: {
    marginStart: 36,
    marginEnd: 36,
    marginBottom: 20,
  },
  text_style: {
    marginTop: 16,
    color: Colors.gray_shade_new,
    paddingStart: 16,
    fontFamily: 'futura-medium',
    fontWeight: 'bold',
  },
  mergin_view: {
    marginTop: 6,
  },
});
