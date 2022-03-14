import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Image, StatusBar, TouchableOpacity, TextInput, ScrollView, ToastAndroid, ActivityIndicator } from 'react-native';
import { encode } from 'base-64';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import { gql } from '@apollo/client';
import client from '../../constants/client';
import { decode } from 'base-64';
import { LoginManager, Profile, AccessToken } from 'react-native-fbsdk-next';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import LinkedInModal from 'react-native-linkedin';
import { Icon } from 'native-base';
import { useTwitter } from 'react-native-simple-twitter';

function LoginScreen(props) {
  const [email, setEmail] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [fbUserID, setFbUserID] = useState('');
  const [fbAccessToken, setFbAccessToken] = useState('');
  const [phoneModal, setPhoneModal] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailcon, setEmailcon] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordcon, setPasswordcon] = useState('');
  const [loading, setLoading] = useState('');
  const [socialId, setSocialId] = useState('');
  const [track, setTrack] = useState('');
  const [icon, setIcon] = useState('eye-off');
  const [passwordState, setPasswordState] = useState(true);
  const linkedRef = useRef();
  const TwitterKeys = {
    TWITTER_COMSUMER_KEY: 'zqgVlMDyoBWRGVNNj6FSpIkKb',
    TWITTER_CONSUMER_SECRET:
      'sReavaBa4gErwJR9OedhLzHRdrJWXk6jnIxEpgRO8zkKnhTdd4',
    TWITTER_COMSUMER_KEY_D: 'qWPj1TXbreMX1SsDvdiQTaF7Y',
    TWITTER_CONSUMER_SECRET_D:
      '4t0cRfGWXZvySIa5sS0M38AnT8a8B8hwcX2lZiaStSWStD4B4Z',
  };

  const HANDLE_LOGIN = gql`
    query login($tokenData: String) {
      sSOLogin(jti: $tokenData) {
        count
        currentPage
        message
        nextPage
        prevPage
        success
        totalPages
        result {
          firstName
          lastName
          userProfileImage
          email
          paymentUrl
          vGender
          streetAddress
          token
          tokenExpires
        }
      }
    }
  `;

  const SOCIAL_LOGIN = gql`
    query {
      oAuth {
        count
        currentPage
        message
        nextPage
        prevPage
        success
        totalPages
        result {
          firstName
          lastName
          paymentUrl
          token
          tokenExpires
        }
      }
    }
  `;

  const getLinkedinUser = async data => {
    const { access_token } = data;
    const response = await fetch(
      'https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))',
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + access_token,
        },
      },
    );
    const apipayload = await response.json();
    console.log(apipayload, 'apipayload----------------------------');
    setSocialId(apipayload?.id);
    setTrack(7)
    sociallogin();
  };

  const getLinkedinUserEmailId = async data => {
    const { access_token } = data;
    const response = await fetch(
      'https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(primary,type,handle~))',
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + access_token,
        },
      },
    );
    const emailpayload = await response.json();
    console.log(emailpayload.elements[0]['handle~'].emailAddress);

  };

  const { twitter, TWModal, loggedInUser, accessToken } = useTwitter({
    onSuccess: (user, accessToken) => {
      console.log(user);
      console.log(accessToken);
      setSocialId(user?.id);
      setTrack(6);
      sociallogin();
    },
  });

  const onLoginPress = async () => {
    try {
      await twitter.login();
    } catch (e) {
      console.log(e.errors);
      ToastAndroid.show(JSON.stringify(e.errors), ToastAndroid.SHORT);
    }
  };

  useEffect(() => {
    console.log(loggedInUser);
    console.log(accessToken);
  }, [loggedInUser, accessToken]);

  useEffect(() => {
    console.log(twitter.getAccessToken(), 'check if access toen');
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/user.birthday.read'],
      webClientId:
        '232834789917-0i6u709vc27u2bo5idli0hgv1v9jhcp9.apps.googleusercontent.com',
      offlineAccess: true, // if you want to access Google API on behalf
      hostedDomain: '',
      forceConsentPrompt: true,
    });
    twitter.setConsumerKey(
      TwitterKeys.TWITTER_COMSUMER_KEY,
      TwitterKeys.TWITTER_CONSUMER_SECRET,
    );
  }, []);

  const facebookSignIn = async () => {
    let result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
      'user_friends',
    ]);
    if (result.isCancelled) {
      console.log('Login cancelled');
    } else {
      const fbProfile = await Profile.getCurrentProfile();
      let token = await AccessToken.getCurrentAccessToken();
      setEmail(fbProfile.email);
      setFname(fbProfile.firstName);
      setLname(fbProfile.lastName);
      setFbUserID(fbProfile.userID);
      setFbAccessToken(token.accessToken);
      setPhoneModal(true);
    }
  };
  const submit = async () => {
    let token = await AsyncStorage.getItem('userToken');
    let rjx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let isValid = rjx.test(email.trim());
    // console.warn(isValid);
    if (email === '' || !isValid) {
      setEmailError('Enter valid email');
      return;
    }
    if (password === '') {
      setPasswordError('Password is required');
      return;
    }
    let decodedLogin = decode(token.split('.')[1]);
    const decodedId = JSON.parse(decodedLogin);
    setLoading(true);
    client
      .query({
        query: HANDLE_LOGIN,
        fetchPolicy: 'no-cache',
        context: {
          headers: {
            Authorization: `Basic ${encode(
              email.trim() + ':' + password.trim(),
            )}`,
          },
          variables: {
            tokenData: decodedId.jti,
          },
        },
      })
      .then(async result => {
        setLoading(false);

        if (result.data.sSOLogin.success) {
          await AsyncStorage.setItem(
            'userToken',
            result.data.sSOLogin.result.token,
          );

          await AsyncStorage.setItem('IsLogin', 'true');
          let decoded = decode(result.data.sSOLogin.result.token.split('.')[1]);
          decoded = JSON.parse(decoded);
          let userInfo = result.data.sSOLogin.result;
          userInfo.id = decoded.Id;
          const resultData = Object.values(decoded);
          await AsyncStorage.setItem('userRole', resultData[3]);
          await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
          props.setUserToken(result.data.sSOLogin.result.token);
          props.navigation.navigate('Main');
        } else {
          ToastAndroid.show(result.data.sSOLogin.message, ToastAndroid.SHORT);
        }
      })
      .catch(err => {
        setLoading(false);
        console.log('Login api', err);
      });
  };

  const sociallogin = async () => {
    setLoading(true);
    client
      .query({
        query: SOCIAL_LOGIN,
        fetchPolicy: 'no-cache',
        context: {
          headers: {
            Authorization: `Basic ${encode(socialId + ':' + track)}`,
            'Content-Length': 0,
          },
        },
      })
      .then(async result => {
        console.log('result', result);
        setLoading(false);

        if (result.data.oAuth.success) {
          await AsyncStorage.setItem(
            'userToken',
            result.data.oAuth.result.token,
          );
          await AsyncStorage.setItem('IsLogin', 'true');
          let decoded = decode(result.data.oAuth.result.token.split('.')[1]);
          decoded = JSON.parse(decoded);
          let userInfo = result.data.oAuth.result;
          userInfo.id = decoded.Id;
          await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
          props.setUserToken(result.data.oAuth.result.token);
          props.navigation.navigate('Main');
        } else {
          ToastAndroid.show(result.data.oAuth.message, ToastAndroid.SHORT);
        }
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
        linkedRef.current.logoutAsync();
      });
  };

  const emailVlidator = () => {
    if (email === '') {
      setEmailError('Email is required');
    } else {
      setEmailError('');
    }
  };

  const passVlidator = () => {
    if (password === '') {
      setPasswordError('Password is required');
    } else {
      setPasswordError('');
    }
  };
  const changeIcon = () => {
    setPasswordState(!passwordState);
    setIcon(icon === 'eye' ? 'eye-off' : 'eye');
  };
  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const getToken = await GoogleSignin.getTokens();
      setSocialId(userInfo.user.id);
      setTrack(4);
      sociallogin();
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('e 1');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('e 2');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('e 3');
      } else {
        console.log(error.message);
      }
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1 }}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <View style={{ flex: 1, padding: 21 }}>
          <Image
            source={require('../../assets/logo.jpg')}
            resizeMode="contain"
            style={{
              width: 210,
              height: 170,
              marginBottom: 10,
              alignSelf: 'center',
            }}
          />
          <View style={{ alignSelf: 'flex-start', marginBottom: 20 }}>
            <Text style={{ color: '#AAA', fontSize: 25 }}>SIGN IN</Text>
          </View>

          <View style={styles.searchSection}>
            <TextInput
              style={[styles.input]}
              onChangeText={text => {
                setEmail(text);
              }}
              onBlur={() => emailVlidator()}
              placeholder="Email"
              placeholderTextColor="#ccc"
              autoCapitalize="none"
            />
          </View>
          <Text style={{ color: 'red', marginLeft: 15 }}>{emailError}</Text>
          <View style={styles.searchSection}>
            <TextInput
              style={[styles.input]}
              onChangeText={text => {
                setPassword(text);
              }}
              onBlur={() => passVlidator()}
              placeholder="Password"
              placeholderTextColor="#ccc"
              autoCapitalize="none"
              secureTextEntry={passwordState}
            />
            <Icon
              style={styles.searchIcon}
              name={icon}
              size={20}
              color="#000"
              onPress={() => changeIcon()}
            />
          </View>
          <Text style={{ color: 'red', marginLeft: 15 }}>{passwordError}</Text>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('ForgotPassword');
            }}>
            <Text
              style={{
                color: '#AAA',
                fontSize: 14,
                marginVertical: 20,
                alignSelf: 'center',
              }}>
              Forgot Your Password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              submit();
            }}
            disabled={loading}
            style={styles.auth_btn}
            underlayColor="gray"
            activeOpacity={0.8}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnTxt}>Continue</Text>
            )}
          </TouchableOpacity>

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
                facebookSignIn();
              }}>
              <Image
                style={{ width: 30, height: 30 }}
                source={require('../../assets/facebook.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                googleSignIn();
              }}>
              <Image
                style={{ width: 33, height: 33 }}
                source={require('../../assets/google.png')}
              />
            </TouchableOpacity>
            <LinkedInModal
              animationType="slide"
              linkImage={require('../../assets/linkdin.png')}
              wrapperStyle={{
                borderRadius: 0,
                borderWidth: 30,
                borderColor: 'white',
              }}
              containerStyle={{
                flex: 1,
                paddingVertical: 0,
                paddingHorizontal: 0,
              }}
              ref={linkedRef}
              clientID="77jk3h838ss2tn"
              clientSecret="iCFuONohOAucHBYx"
              redirectUri="https://www.ezyfind.co.za/oauthlinkedin"
              onSuccess={token => {
                getLinkedinUser(token);
                getLinkedinUserEmailId(token);
              }}
            />
            <TouchableOpacity
              onPress={() => {
                onLoginPress();
              }}>
              <Image
                style={{ width: 33, height: 33 }}
                source={require('../../assets/twitter.png')}
              />
            </TouchableOpacity>
            <TWModal />
          </View>
          <TouchableOpacity
            style={{ marginTop: 15 }}
            activeOpacity={0.7}
            onPress={() => {
              props.navigation.navigate('SignUp');
            }}>
            <Text style={{ color: '#CCC', alignSelf: 'center' }}>
              Dont have an account?{' '}
              <Text
                style={{
                  fontSize: 16,
                  color: '#CCC',
                  fontWeight: 'bold',
                  alignSelf: 'center',
                }}>
                SIGN UP
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const mapDispatchToProps = dispatch => ({
  setUserToken: value => {
    dispatch({
      type: 'SET_TOKEN',
      payload: value,
    });
  },
});

export default connect(null, mapDispatchToProps)(LoginScreen);

const styles = StyleSheet.create({
  auth_textInput: {
    alignSelf: 'center',
    width: '93%',
    borderBottomWidth: 1,
    color: '#000',
    marginTop: 20,
  },
  auth_btn: {
    marginTop: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: 'red',
    borderRadius: 25,
    width: '70%',
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  btnTxt: {
    fontSize: 14,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  searchIcon: {
    padding: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    borderBottomWidth: 1,
    color: '#000',
  },
});
