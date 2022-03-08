import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Keyboard,
  TextInput,
  Modal,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  textInput,
  buttonStyle,
} from '../components/styles';
import Colors from '../constants/colors';
import { BASE_URL } from './API_baseURL';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../components/loader';
import Toast from 'react-native-root-toast';

export default class ResetPassword extends React.Component {
  state = {
    Oldpassword: '',
    Newpassword: '',
    cpassword: '',
    locationResult: null,
    disableBtn: false,
    isLoading: false,
  };

  showToast = msg => {
    if (this.toast) Toast.hide(this.toast);
    this.toast = Toast.show(msg, {
      duration: 1500,
      position: Toast.positions.BOTTOM,
      backgroundColor: '#000',
      textColor: '#FFF',
    });
  };
  validation = () => {
    if (this.state.Oldpassword.trim().length <= 0) {
      this.showToast('The Old Password Field is required');
    } else if (this.state.Newpassword.trim().length <= 0) {
      this.showToast('The New Password Field is required');
    } else if (this.state.cpassword.trim().length <= 0) {
      this.showToast('The Confirm New Password Field is required');
    } else if (
      // (this.state.cpassword == this.state.Newpassword)
      this.state.Newpassword.trim() !== this.state.cpassword.trim()
    ) {
      this.showToast('New Password and Confirm Password Must be Same');
    } else {
      this.handleSubmit();
    }
  };

  handleSubmit = async () => {
    this.setState({ isLoading: true });

    let params = {
      oldpassword: this.state.Oldpassword,
      newpassword: this.state.Newpassword,
      confirm_password: this.state.cpassword,
    };
    var user_token = await AsyncStorage.getItem('user_token');
    return fetch(BASE_URL + 'user/change_password', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + user_token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('Change Password', JSON.stringify(responseJson));
        this.setState({
          isLoading: false,
          Oldpassword: '',
          Newpassword: '',
          cpassword: '',
        });
        if (responseJson.code === 200) {
          this.showToast(responseJson.message);
          this.props.navigation.navigate('Main');
        } else {
          this.showToast(responseJson.message);
          console.log(responseJson.message);
        }
      })
      .catch(error => {
        console.error(error);
        this.setState({ isLoading: false });
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView
          enableAutomaticScroll
          enableOnAndroid
          resetScrollToCoords={{ x: 0, y: 0 }}
          contentContainerStyle={{}}
          style={{ flex: 1 }}
          scrollEnabled={true}
          keyboardShouldPersistTaps="handled">
          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
            }}
            activeOpacity={1}
            style={styles.container}>
            <View style={styles.bottom_view}>
              <TextInput
                style={[textInput.auth_textInput]}
                onChangeText={Oldpassword => this.setState({ Oldpassword })}
                value={this.state.Oldpassword}
                placeholder="Enter Old Password"
                secureTextEntry={true}
                placeholderTextColor={Colors.dark_gray}
                autoCapitalize="none"
              />

              <TextInput
                style={[textInput.auth_textInput]}
                onChangeText={Newpassword => this.setState({ Newpassword })}
                value={this.state.Newpassword}
                placeholder="Enter New Password"
                secureTextEntry={true}
                placeholderTextColor={Colors.dark_gray}
                autoCapitalize="none"
              />

              <TextInput
                style={[textInput.auth_textInput]}
                onChangeText={cpassword => this.setState({ cpassword })}
                value={this.state.cpassword}
                placeholder="Enter Confirm Password"
                secureTextEntry={true}
                placeholderTextColor={Colors.dark_gray}
                autoCapitalize="none"
              />

              <TouchableOpacity
                onPress={() => {
                  this.validation();
                }}
                style={buttonStyle.auth_btn}
                underlayColor="gray"
                activeOpacity={0.8}
                disabled={this.state.disableBtn}>
                <Text style={buttonStyle.loginText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
        <SafeAreaView />
        {this.state.isLoading ? (
          <Modal transparent={true}>
            <Loader />
          </Modal>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  triangleCorner: {
    flex: 1,
    left: 0,
    height: 300,
    backgroundColor: 'rgba(25,36,90,0.85)',
    borderStyle: 'solid',
    borderLeftWidth: Dimensions.get('window').width,
    borderBottomWidth: 40,
    borderLeftColor: 'transparent',
    borderBottomColor: 'white',
  },
  top_view: {
    backgroundColor: Colors.secondColor,
    height: 300,
  },
  app_icon: {
    marginTop: 60,
    width: 180,
    height: 56,
  },
  // main_container: {
  //   flex: 1,
  //   width: '100%',
  //   flexDirection: 'column',
  //   alignItems: 'center',
  //   justifyContent: 'flex-end',
  // },
  loginScreenButton: {
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: Colors.shades_blue,
    borderRadius: 4,
    width: '100%',
    height: 46,
    justifyContent: 'center',
  },

  facebookScreenButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: Colors.blue_shade,
    borderRadius: 50,
    height: 46,
    justifyContent: 'center',
    flex: 1,
    marginRight: 8,
    flexDirection: 'row',
  },

  accountScreenButton: {
    flex: 1,
    marginTop: 10,
    padding: 10,
    backgroundColor: Colors.secondColor,
    borderRadius: 50,
    height: 46,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  loginText: {
    color: '#fff',
    textAlign: 'center',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 16,
  },
  forgot_pass: {
    color: Colors.gray_shade,
    marginTop: 16,
    alignSelf: 'flex-end',
    textDecorationLine: 'underline',
    marginBottom: 16,
    fontFamily: 'futura-book',
  },
  sign_in_txt: {
    color: Colors.white_color,

    fontSize: 26,
  },
  bottom_view: {
    marginTop: 60,
    marginStart: 36,
    marginEnd: 36,
  },
});
