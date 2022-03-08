import React, { useState } from 'react';
import CheckBox from 'react-native-check-box';
import { Text, Image, View, StyleSheet, TextInput, Platform, ScrollView, Modal as MD, SafeAreaView, TouchableOpacity, Alert, ToastAndroid, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { bearerToken } from '../../constants/utils';
import client from '../../constants/client';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Modal from 'react-native-modal';
import { LoginManager, Profile, AccessToken } from 'react-native-fbsdk-next';
import { HANDLE_SIGNUP, CHECK_MAIL, HANDLE_SIGNUP_BUSINESS } from '../../constants/queries';

import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';

Geocoder.init("AIzaSyCNjKB84RyfVRuvuU8sCcQT6uWB_wVY03s")


export default class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: true,
      loading: false,
      termsCheck: false,
      phoneModal: false,
      email: '',
      password: '',
      fname: '',
      lname: '',
      cpassword: '',
      contact: '',
      companyName: '',
      track: 1,
      googleUserId: '',
      fbUserID: '',
      fbAccessToken: '',
      showResultsNew: 'true',
      bgcolor: '#F39B9D',
      notbgcolor: 'white',
      setLatitude: '',
      setLongitude: ''
    };
    this.facebookSignIn = this.facebookSignIn.bind(this);
  }

  validate = text => {
    // console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      ToastAndroid.showWithGravity(
        'Email is Not Correct',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      this.setState({ email: text });
      return false;
    } else {
      this.setState({ email: text });
    }
  };
  componentDidMount() {

    GoogleSignin.configure({
      scopes: ["https://www.googleapis.com/auth/user.birthday.read"],
      webClientId: '232834789917-0i6u709vc27u2bo5idli0hgv1v9jhcp9.apps.googleusercontent.com',
      offlineAccess: true, // if you want to access Google API on behalf 
      hostedDomain: '',
      forceConsentPrompt: true,
    });
    this.getLocation();
  }


  buttonClickListener() {
    this.setState({ isVisible: false });
  }

  getLocation = () => {
    Geolocation.getCurrentPosition((position) => {
      console.log('position', position);
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      this.setState({ setLatitude: latitude });
      this.setState({ setLongitude: longitude });
    }, (error) => {
      console.log(error.code, error.message);
      Alert.alert('Please on location', error.message)
    },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 100000
      });
  }

  async checkEmailExist() {
    console.log('checkEmailExist bearerToken', bearerToken);
    try {
      let result = await client.query({
        query: CHECK_MAIL,
        fetchPolicy: 'network-only',
        context: {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
            Accept: '*/*',
          },
        },
        variables: {
          email: this.state.email,
        },
      });
      return result.data.emailCheck.success;
    } catch (error) {
      console.log('checkEmailExist', error);
    }
  }

  async handleSignUp() {
    if (this.state.showResultsNew == 'false') {
      this.props.navigation.push('SetSubscriptionPlan');
    } else {
      this.setState({ loading: true });

      if (this.state.contact.length < 10) {
        ToastAndroid.show('Please enter valid contact', ToastAndroid.SHORT);
        this.setState({ loading: false });
        return;
      }
      let rjx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      let isValid = rjx.test(this.state.email);
      if (!isValid) {
        ToastAndroid.show('Please enter valid email', ToastAndroid.SHORT);
        this.setState({ loading: false });
        return;
      }
      if (this.state.password !== this.state.cpassword) {
        ToastAndroid.show('Password does not match', ToastAndroid.SHORT);
        this.setState({ loading: false });
        return;
      }
      if (this.state.email === '' || this.state.password === '' || this.state.cpassword === '' || this.state.contact === '' || this.state.fname === '' || this.state.lname === '') {
        ToastAndroid.show('Please enter all details', ToastAndroid.SHORT);
        this.setState({ loading: false });
        return;
      }
      let isEmailExist = await this.checkEmailExist();
      if (isEmailExist) {
        ToastAndroid.show('Email already exists', ToastAndroid.SHORT);
        this.setState({ loading: false });
        return;
      }

      let token = await AsyncStorage.getItem('userToken');
      let fcm_token = await AsyncStorage.getItem('fcm_token');
      let isPlatform = 1;
      if (Platform.OS == 'android') {
        isPlatform = 1;
      }
      else if (Platform.OS == 'ios') {
        isPlatform = 2;
      } else {
        isPlatform = 3;
      }
      let variablestt = {
        name: this.state.fname,
        lname: this.state.lname,
        email: this.state.email,
        contactNo: this.state.contact,
        password: this.state.password,
        track: this.state.track,
        gid: this.state.googleUserId,
        fBAccessCode: this.state.fbAccessToken,
        facebookUserID: this.state.fbUserID,
        deviceID: fcm_token,
        deviceType: isPlatform,
        latitude: this.state.setLatitude,
        longitude: this.state.setLongitude
      }
      console.log('variablestt variablestt', variablestt)
      client
        .mutate({
          mutation: HANDLE_SIGNUP,
          fetchPolicy: 'no-cache',
          variables: {
            name: this.state.fname,
            lname: this.state.lname,
            email: this.state.email,
            contactNo: this.state.contact,
            password: this.state.password,
            track: this.state.track,
            gid: this.state.googleUserId,
            fBAccessCode: this.state.fbAccessToken,
            facebookUserID: this.state.fbUserID,
            deviceID: fcm_token,
            deviceType: isPlatform,
            latitude: "'" + this.state.setLatitude + "'",
            longitude: "'" + this.state.setLongitude + "'"
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        })
        .then(async result => {
          console.log(result);
          this.setState({ loading: false });

          if (result.data.registerUser.success) {
            Alert.alert('', 'Registration Successfull', [
              {
                text: 'LOGIN',
                onPress: () => {
                  this.props.navigation.goBack();
                },
              },
            ]);
          }
        })
        .catch(err => {
          this.setState({ loading: false });
          console.log('handleSignUp', err);
        });
    }
  }
  async handleSignUpBusiness() {
    this.setState({ loading: true });
    console.log('business')
    if (this.state.contact.length < 10) {
      ToastAndroid.show('Please enter valid contact', ToastAndroid.SHORT);
      this.setState({ loading: false });
      return;
    }
    let rjx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let isValid = rjx.test(this.state.email);
    if (!isValid) {
      ToastAndroid.show('Please enter valid email', ToastAndroid.SHORT);
      this.setState({ loading: false });
      return;
    }
    if (this.state.password !== this.state.cpassword) {
      ToastAndroid.show('Password does not match', ToastAndroid.SHORT);
      this.setState({ loading: false });
      return;
    }
    if (this.state.password == '') {
      ToastAndroid.show('Please enter company name', ToastAndroid.SHORT);
      this.setState({ loading: false });
      return;
    }
    if (this.state.email === '' || this.state.password === '' || this.state.cpassword === '' || this.state.contact === '' || this.state.fname === '' || this.state.lname === '') {
      ToastAndroid.show('Please enter all details', ToastAndroid.SHORT);
      this.setState({ loading: false });
      return;
    }
    let isEmailExist = await this.checkEmailExist();
    if (isEmailExist) {
      ToastAndroid.show('Email already exists', ToastAndroid.SHORT);
      this.setState({ loading: false });
      return;
    }
    client
      .mutate({
        mutation: HANDLE_SIGNUP_BUSINESS,
        fetchPolicy: 'no-cache',
        variables: {
          name: this.state.fname,
          lname: this.state.lname,
          email: this.state.email,
          contactNo: this.state.contact,
          password: this.state.password,
          companyName: this.state.companyName,
        },
        context: {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIiLCJqdGkiOiI0OGE0MDc5My0xY2FlLTRiNDMtODljYS0wNDFjZTkyZjE3NzAiLCJJZCI6IjIwMzM4IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiSW5kaXZpZHVhbChTZWVrZXIpIiwiZXhwIjoxNjMyOTA4ODIwLCJpc3MiOiJ3d3cuRXp5RmluZC5jby56YSIsImF1ZCI6Ind3dy5FenlGaW5kLmNvLnphIn0.pekZ6Z6jAfhMybiJgr73YbcLf09YbYuwpsjXy_1VnWs`,
            'Content-Type': 'application/json',
          },
        },
      })
      .then(async result => {
        console.log('HANDLE_SIGNUP_BUSINESS>>>>', result);
        this.setState({ loading: false });

        if (result.data.registerBusiness.success) {
          Alert.alert('', 'Registration Successfull', [
            {
              text: 'LOGIN',
              onPress: () => {
                this.props.navigation.goBack();
              },
            },
          ]);
        } else {
          ToastAndroid.show(
            result.data.registerBusiness.message,
            ToastAndroid.SHORT,
          );
        }
      })
      .catch(err => {
        this.setState({ loading: false });
        console.log('handleSignUp', err);
      });
  }
  async googleSignIn() {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn()
      const getToken = await GoogleSignin.getTokens()
      console.log("google", userInfo)
      this.setState({
        email: userInfo.user.email,
        fname: userInfo.user.givenName,
        lname: userInfo.user.familyName,
        track: 4,
        googleUserId: userInfo.user.id,
        password: '2',
        cpassword: '2',
        phoneModal: true,
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async facebookSignIn() {
    let result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
      'user_friends',
    ]);
    if (result.isCancelled) {
      console.log('Login cancelled');
    } else {
      console.log(result);
      console.log(
        'Login success with permissions: ' +
        result.grantedPermissions.toString(),
      );

      const fbProfile = await Profile.getCurrentProfile();
      let token = await AccessToken.getCurrentAccessToken();
      console.log('accessToken ----', token.accessToken);

      this.setState({
        email: fbProfile.email,
        fname: fbProfile.firstName,
        lname: fbProfile.lastName,
        fbUserID: fbProfile.userID,
        fbAccessToken: token.accessToken,
        phoneModal: true,
      });
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={{ backgroundColor: 'white' }}>
          <View style={styles.paddingview}>
            <MD
              transparent={true}
              style={{ opacity: 0.2 }}
              animationType="fade"
              visible={this.state.isVisible}
              onRequestClose={() => {
                console.log('Modal has been closed.');
              }}>
              <View style={styles.newmodal} >
                <View style={styles.modalInner}>
                  <Text style={styles.text}>Select Account Type</Text>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      padding: 20,
                      alignSelf: 'center',
                      backgroundColor: 'white',
                    }}>
                    <TouchableOpacity onPress={() => {
                      this.setState({ showResultsNew: 'true' })
                    }}>
                      <View
                        style={{
                          padding: 20,
                          borderColor: 'red',
                          backgroundColor: this.state.showResultsNew == 'true' ? this.state.bgcolor : this.state.notbgcolor,
                          borderWidth: 1,
                          marginRight: 20,
                          borderRadius: 10,
                        }}>
                        <Image
                          style={{
                            width: 70,
                            height: 90,
                            marginBottom: 17,
                            marginLeft: 10,
                          }}
                          source={require('../../assets/Group49.png')}
                        />
                        <Text style={{ color: '#323232', fontSize: 20 }}>
                          Individual
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                      this.setState({ showResultsNew: 'false' })
                    }}>
                      <View
                        style={{
                          padding: 20,
                          borderColor: 'red',
                          backgroundColor: this.state.showResultsNew == 'false' ? this.state.bgcolor : this.state.notbgcolor,
                          borderWidth: 1,
                          borderRadius: 10,
                        }}>
                        <Image
                          style={{
                            width: 70,
                            height: 90,
                            marginBottom: 15,
                            marginLeft: 7,
                          }}
                          source={require('../../assets/Group47.png')}
                        />
                        <Text style={{ color: '#323232', fontSize: 20 }}>
                          Business
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={() => {
                    this.setState({ isVisible: false });
                    if (this.state.showResultsNew == 'false') {
                      this.props.navigation.push('SetSubscriptionPlan');
                    } else {
                    }
                  }}>
                    <Image
                      style={{ marginLeft: 7, marginBottom: 10 }}
                      source={require('../../assets/button.png')}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </MD>
            <View style={{ marginTop: 20 }}>
              <TextInput
                style={styles.textinput}
                onChangeText={text => this.setState({ fname: text })}
                underlineColorAndroid="gray"
                placeholder="FIRST NAME"
                placeholderTextColor="gray"
              />
              <TextInput
                style={styles.textinput}
                onChangeText={text => this.setState({ lname: text })}
                underlineColorAndroid="gray"
                placeholder="LAST NAME"
                placeholderTextColor="gray"
              />
              {/* {this.state.showResultsNew == 'false' && (
                <TextInput
                  style={styles.textinput}
                  onChangeText={text => this.setState({ companyName: text })}
                  underlineColorAndroid="gray"
                  placeholder="COMPANY NAME"
                  placeholderTextColor="gray"
                />
              )} */}
              <TextInput
                style={styles.textinput}
                onChangeText={text => this.setState({ contact: text })}
                underlineColorAndroid="gray"
                placeholder="CONTACT NUMBER"
                placeholderTextColor="gray"
                keyboardType="number-pad"
                maxLength={10}
              />
              <TextInput
                style={styles.textinput}
                onChangeText={text => this.setState({ email: text })}
                underlineColorAndroid="gray"
                placeholder="EMAIL"
                placeholderTextColor="gray"
                autoCapitalize="none"
              />

              <TextInput
                style={styles.textinput}
                onChangeText={val => {
                  this.setState({ password: val });
                }}
                underlineColorAndroid="gray"
                placeholder="PASSWORD"
                placeholderTextColor="gray"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.textinput}
                onChangeText={val => {
                  this.setState({ cpassword: val });
                }}
                underlineColorAndroid="gray"
                placeholder="REPEAT PASSWORD"
                placeholderTextColor="gray"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.container}>
              <View style={styles.checkboxContainer}>
                <CheckBox
                  isChecked={this.state.termsCheck}
                  onClick={() => {
                    this.setState({ termsCheck: !this.state.termsCheck });
                  }}
                />
              </View>
              <Text
                style={{
                  color: '#919191',
                  marginLeft: 37,
                  marginTop: -22,
                  opacity: 0.5,
                }}>
                I Agree With the
              </Text>
              <Text style={{ color: '#919191', marginLeft: 135, marginTop: -19 }}>
                Terms And Conditions
              </Text>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.handleSignUp();
              }}>
              {this.state.loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Continue</Text>
              )}
            </TouchableOpacity>

            <View
              style={{
                borderBottomColor: 'black',
                borderBottomWidth: 1,
                marginTop: 50,
              }}
            />
            <View>
              <Text
                style={{
                  color: '#AAA',
                  fontSize: 14,
                  marginVertical: 15,
                  alignSelf: 'center',
                }}>
                Sign up with
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  width: '100%',
                  marginTop: 10,
                  marginBottom: 10,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.facebookSignIn();
                  }}>
                  <Image
                    style={{ width: 30, height: 30 }}
                    source={require('../../assets/facebook.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.googleSignIn();
                  }}>
                  <Image
                    style={{ width: 33, height: 33 }}
                    source={require('../../assets/google.png')}
                  />
                </TouchableOpacity>

                <Image
                  style={{ width: 33, height: 33 }}
                  source={require('../../assets/linkdin.png')}
                />
                <Image
                  style={{ width: 33, height: 33 }}
                  source={require('../../assets/twitter.png')}
                />
              </View>
            </View>
            {/* )} */}
            <Modal isVisible={this.state.phoneModal}>
              <View style={{ backgroundColor: '#fff', padding: 20 }}>
                <Text>Please enter detail below</Text>
                <TextInput
                  style={styles.textinput}
                  onChangeText={text => this.setState({ contact: text })}
                  underlineColorAndroid="gray"
                  placeholder="CONTACT NUMBER"
                  placeholderTextColor="gray"
                  keyboardType="number-pad"
                  maxLength={10}
                />
                {this.state.email === '' && (
                  <TextInput
                    style={styles.textinput}
                    onChangeText={text => this.setState({ email: text })}
                    underlineColorAndroid="gray"
                    placeholder="EMAIL"
                    placeholderTextColor="gray"
                    autoCapitalize="none"
                  />
                )}
                <TouchableOpacity
                  onPress={() => {
                    if (this.state.contact === '' || this.state.email === '') {
                      ToastAndroid.show(
                        'Please enter contact number and email',
                        ToastAndroid.SHORT,
                      );
                    } else {
                      this.setState({ phoneModal: false });
                      this.handleSignUp();
                    }
                  }}>
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>Submit</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Modal>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'red',
    padding: 100,
  },
  headerWrapper: {
    borderBottomColor: 'gray',
    borderBottomWidth: 2,
    marginBottom: 30,
  },
  header: {
    fontSize: 35,
    color: 'gray',
    marginBottom: 10,
  },
  signup: {
    marginTop: -11,
    alignSelf: 'center',
    fontSize: 15,
    color: '#8E8E8E',
    width: 90,
    backgroundColor: '#ffffff',
  },
  paddingview: {
    padding: 20,
  },
  box: {
    flexBasis: 75,
    borderWidth: 1,
    borderColor: 'black',
    height: 40,
    margin: 10,
  },
  forgetPass: {
    marginTop: 50,
    alignSelf: 'center',
    fontSize: 15,
    color: 'gray',
  },
  checkboxContainer: {
    marginTop: 25,
  },
  checklable: {
    borderRadius: 20,
    borderColor: 'gray',
  },
  button: {
    backgroundColor: '#db3236',
    padding: 15,
    borderRadius: 20,
    width: 220,
    marginTop: 20,
    alignSelf: 'center',
  },
  newbutton: {
    backgroundColor: '#db3236',
    padding: 8,
    borderRadius: 20,
    width: 180,
    marginTop: 30,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    alignSelf: 'center',
  },
  newbuttonText: {
    color: 'white',
    alignSelf: 'center',
    fontSize: 20,
  },
  tinyLogo: {
    width: 170,
    height: 100,
    resizeMode: 'stretch',
    marginLeft: 70,
    marginRight: 70,
    marginBottom: 50,
    marginTop: 50,
  },

  newOne: {
    width: 170,
    flex: 3,
  },
  newsignup: {
    fontSize: 15,
    color: 'gray',
  },
  dont: {
    fontSize: 14,
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
  },
  newmodal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  cardonclick: {
    backgroundColor: 'pink',
  },
  cardnotclick: {
    backgroundColor: 'white',
  },
  modalInner: {
    height: 320,
    width: 320,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    borderRadius: 20,
    marginLeft: 40,
    marginRight: 40,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    fontSize: 20,
    fontWeight: '700',
    color: 'black',
    marginTop: 11,
  },
  extinput: {
    marginTop: 193,
    fontSize: 15,
  },
  textinput: {
    marginTop: 16,
    fontSize: 15,
  },
});
