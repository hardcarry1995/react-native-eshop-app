import { StyleSheet, Platform } from 'react-native';
import Colors from '../constants/colors';

const textInput = StyleSheet.create({
  auth_textInput: {
    width: '100%',
    height: 46,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.gray_light,
    color: Colors.dark_gray,
    marginTop: 10,
    textAlign: 'center',
    //fontFamily: "FuturaPTBook",
    fontSize: 18,
  },
  gray_textInput: {
    width: '100%',
    height: 46,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.light_gray,
    //color: Colors.light_gray,
    marginTop: 10,
    textAlign: 'center',
    //fontFamily: 'futura-book',
    fontWeight: 'bold',
    fontSize: 14,
  },
  profile_textInput: {
    width: '100%',
    height: 46,
    borderRadius: 46,
    borderWidth: 1,
    borderColor: Colors.gray_light,
    color: Colors.dark_gray,
    marginTop: 4,
    //fontFamily: "FuturaPTMedium",
    fontSize: 17,
    paddingStart: 16,
  },
});

const buttonStyle = StyleSheet.create({
  auth_btn: {
    marginTop: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: Colors.primaryColor,
    borderRadius: 50,
    width: '100%',
    height: 46,
    justifyContent: 'center',
  },
  loginText: {
    color: Colors.white_color,
    textAlign: 'center',
    alignSelf: 'center',
    textAlign: 'center',
    //fontFamily: 'FuturaPTBook',
    fontSize: 20,
  },
  login_btn: {
    marginTop: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: Colors.shades_blue,
    borderRadius: 50,
    width: '100%',
    height: 46,
    justifyContent: 'center',
  },

  btnText: {
    color: '#fff',
    textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: 'futura-bold',
    fontSize: 14,
  },

  primaryBtn: {
    marginTop: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: Colors.primaryColor,
    borderRadius: 50,
    width: '100%',
    height: 46,
    justifyContent: 'center',
  },

  lightGrayBtn: {
    marginTop: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: Colors.light_gray,
    borderRadius: 50,
    width: '100%',
    height: 46,
    justifyContent: 'center',
    fontFamily: 'futura-bold',
    color: Colors.dark_gray,
  },
  spinnerTextStyle: {
    color: '#fff',
    fontFamily: 'futura-medium',
    fontSize: 16,
  },
});

const textHeader = StyleSheet.create({
  header: {
    color: '#000',
    //fontFamily: 'FuturaPTMedium',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    //width: '100%'
  },
  header_style: {
    height: Platform.OS === 'ios' ? 95 : 78,
  },
  leftIcon: {
    justifyContent: 'center',
    paddingLeft: 20,
    width: 48,
    height: 48,
  },
  rightIcon: {
    justifyContent: 'center',
    paddingRight: 20,
    width: 48,
    height: 48,
  },
});

const text_color = StyleSheet.create({
  white_color: {
    color: '#fff',
  },
  gray_color: {
    color: Colors.light_gray,
  },
  black_color: {
    color: '#000',
  },
});

// 'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
// 'futura-book': require('./assets/fonts/tt0140m_1.ttf'),
// 'futura-bold': require('./assets/fonts/tt0144m_1.ttf'),
// 'futura-medium': require('./assets/fonts/tt0142m_1.ttf'),
// 'futura-light': require('./assets/fonts/FutuLt.ttf'),
// 'futura-heavy': require('./assets/fonts/FUTURAH.ttf'),
// 'futura-extra-heavy': require('./assets/fonts/FUTURAXK.ttf'),

const fontFamily = {
  //regular: 'FuturaPTBook',
  // bold: 'OpenSans-Bold',
  //Semibold: 'FuturaPTMedium',
  // light: 'OpenSans-Light'
};

const fontSize = {
  regular: 16,
  small: 14,
  middle: 20,
  Semimiddle: 16,
};

const font_style = StyleSheet.create({
  font_heavy: {
    fontFamily: 'FUTURAH',
  },
  font_Book: {
    //fontFamily: 'tt0140m_1'
  },
  font_bold: {
    //fontFamily: 'tt0144m_1'
  },
  font_medium: {
    //fontFamily: 'tt0142m_1'
  },
  font_light: {
    fontFamily: 'FutuLt',
  },
});

// const font_style = StyleSheet.create({
//   font_heavy: {
//     fontFamily: 'futura-heavy'
//   },
//   font_Book: {
//     fontFamily: 'futura-book'
//   },
//   font_bold: {
//     fontFamily: 'futura-bold'
//   },
//   font_medium: {
//     fontFamily: 'futura-medium'
//   },
//   font_light: {
//     fontFamily: 'futura-light'
//   }
// });

const view_style = StyleSheet.create({
  cardView: {
    flex: 1,
    padding: 15,
    margin: 15,
    marginBottom: 5,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#00000090',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,

    elevation: 3,
  },
});

export {
  textInput,
  buttonStyle,
  text_color,
  font_style,
  textHeader,
  view_style,
  fontFamily,
  fontSize,
};
