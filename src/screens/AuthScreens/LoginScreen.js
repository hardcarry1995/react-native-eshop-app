import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Image, StatusBar, TouchableOpacity, TextInput, ScrollView, ToastAndroid, ActivityIndicator, Platform } from 'react-native';
import { encode } from 'base-64';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import { gql } from '@apollo/client';
import client from '../../constants/client';
import { HANDLE_SIGNUP, CHECK_MAIL } from '../../constants/queries';
import { decode } from 'base-64';
import { LoginManager, Profile, AccessToken } from 'react-native-fbsdk-next';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import LinkedInModal from 'react-native-linkedin';
import { Icon } from 'native-base';
import { useTwitter } from 'react-native-simple-twitter';
import { appleAuth, AppleButton } from '@invertase/react-native-apple-authentication';
import Modal from 'react-native-modal';
import Geolocation from '@react-native-community/geolocation';
import { bearerToken } from '../../constants/utils';


function LoginScreen(props) {
  const [email, setEmail] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [fbUserID, setFbUserID] = useState('');
  const [fbAccessToken, setFbAccessToken] = useState('');
  const [phoneModal, setPhoneModal] = useState(false);
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
  const [contact, setContact] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [socialType, setSocialType] = useState("");
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
    query socialAuth($jti: String){
      oAuth(jti: $jti) {
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
    setSocialType("linkedin");
    setSocialId(apipayload?.id);
    setTrack(7)
    sociallogin(apipayload?.id, 7);
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

  };

  const { twitter, TWModal, loggedInUser, accessToken } = useTwitter({
    onSuccess: (user, accessToken) => {
      setSocialType("twitter");
      setSocialId(user?.id);
      setTrack(6);
      sociallogin(user?.id, 6);
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
    twitter.setConsumerKey(
      TwitterKeys.TWITTER_COMSUMER_KEY,
      TwitterKeys.TWITTER_CONSUMER_SECRET,
    );
  }, []);

  useEffect(() => {
    Geolocation.getCurrentPosition((position) => {
      console.log('position', position);
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      setLatitude(latitude);
      setLongitude(longitude);
    }, (error) => {
      console.log(error.code, error.message);
    },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 100000
      });
  }, [])

  const facebookSignIn = async () => {
    let result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
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
      setSocialType("facebook");
      setSocialId(() => fbProfile.userID);
      setTrack(() => 3);
      sociallogin(fbProfile.userID, 3)
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
          await AsyncStorage.setItem('userRole', decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
          await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
          props.setUserToken(result.data.sSOLogin.result.token);
          props.setUserData(userInfo);
          props.setUserRole(decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
          props.navigation.reset({
            index: 0,
            routes: [{ name : 'Main'}]
          });
        } else {
          if(Platform.OS === 'android'){
            ToastAndroid.show(result.data.sSOLogin.message, ToastAndroid.SHORT);
          } else {
            alert(result.data.sSOLogin.message);
          }
        }
      })
      .catch(err => {
        setLoading(false);
        console.log('Login api', err);
      });
  };

  const sociallogin = async (_socialId = socialId, _track = track) => {
    let token = await AsyncStorage.getItem('userToken');
    const decodedJWT = JSON.parse(decode(token.split('.')[1]));
    const jti = decodedJWT.jti;
    setLoading(true);
    client
      .query({
        query: SOCIAL_LOGIN,
        fetchPolicy: 'no-cache',
        context: {
          headers: {
            Authorization: `Basic ${encode(_socialId + ':' + _track)}`,
            'Content-Length': 0,
          },
          variables: {
            jti: jti,
          },
        },
      })
      .then(async result => {
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
          await AsyncStorage.setItem('userRole', decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
          await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
          props.setUserData(userInfo);
          props.setUserRole(decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
          props.setUserToken(result.data.oAuth.result.token);
          props.navigation.reset({
            index: 0,
            routes: [{ name : 'Main'}]
          });
        } else {
          if(Platform.OS === 'android'){
            ToastAndroid.show(result.data.oAuth.message, ToastAndroid.SHORT);
          } else {
            console.log(result.data.oAuth);
          }
          // props.navigation.navigate('SignUp');
          setPhoneModal(true);
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
      setSocialType("google");
      setSocialId(userInfo.user.id);
      setTrack(4);
      sociallogin(userInfo.user.id, 4);
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

  const onAppleButtonPress = async () => {
    try{
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });
      
      // get current authentication state for user
      // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
      const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

      console.log("Credential State:", credentialState);

      // use credentialState response to ensure the user is authenticated
      if (credentialState === appleAuth.State.AUTHORIZED) {
        // user is authenticated
        console.log("Apple Auth Request ResponseTEST:", appleAuthRequestResponse);
        
        // setSocialType("apple");
        // setSocialId(() => appleAuthRequestResponse.user);
        // setTrack(() => 8);
        // sociallogin(appleAuthRequestResponse.user, 8)
      }
    } catch (e){
      console.log("Apple Login Error:", e);
    }
    
  }

  const checkEmailExist = async () => {
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
          email: email,
        },
      });
      return result.data.emailCheck.success;
    } catch (error) {
      console.log('checkEmailExist', error);
    }
  }

  const handleSignUp = async () => {
      setLoading(true);
      if (contact.length < 10) {
        alert("Please enter valid contact");
        setLoading(false)
        return;
      }
      let rjx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      let isValid = rjx.test(email);
      if (!isValid) {
        alert("Please enter valid email");
        setLoading(false);
        return;
      }

      if (email === '' || contact === '' || fname === '' || lname === '') {
        alert("Please enter all details");
        setLoading(false);
        return;
      }
      let isEmailExist = await checkEmailExist();
      if (isEmailExist) {
        alert("Email already exists");
        setLoading(false);
        return;
      }
      setPhoneModal(false);
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
      client
        .mutate({
          mutation: HANDLE_SIGNUP,
          fetchPolicy: 'no-cache',
          variables: {
            name: fname,
            lname: lname,
            email: email,
            contactNo: contact,
            password: "2",
            track: track,
            gid: socialType == "google" ? socialId : "",
            fBAccessCode: fbAccessToken,
            facebookUserID: fbUserID,
            appleUserID: socialType=="apple" ? socialId : "",
            deviceID: fcm_token,
            deviceType: isPlatform,
            latitude:latitude.toString(),
            longitude: longitude.toString(),
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        })
        .then(async result => {
          setLoading(false);
          if (result.data.registerUser.success) {
            await AsyncStorage.setItem(
              'userToken',
              result.data.registerUser.result.token,
            );
            await AsyncStorage.setItem('IsLogin', 'true');
            let decoded = decode(result.data.registerUser.result.token.split('.')[1]);
            decoded = JSON.parse(decoded);
            let userInfo = result.data.registerUser.result;
            userInfo.id = decoded.Id;
            await AsyncStorage.setItem('userRole', decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
            await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
            props.setUserData(userInfo);
            props.setUserRole(decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
            props.setUserToken(result.data.registerUser.result.token);
            props.navigation.reset({
              index: 0,
              routes: [{ name : 'Main'}]
            });
          } else {
            alert(result.data.registerUser.message);
          }
        })
        .catch(err => {
          setLoading(false);
          console.log('handleSignUp', err);
        });
  }

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
            style={{ width: 210, height: 170, marginBottom: 10, alignSelf: 'center' }}
          />
          <View style={{ alignSelf: 'flex-start', marginBottom: 20 }}>
            <Text style={{ color: '#AAA', fontSize: 25 }}>SIGN IN</Text>
          </View>

          <View style={styles.searchSection}>
            <TextInput
              style={[styles.input]}
              onChangeText={setEmail}
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
              onChangeText={setPassword}
              onBlur={() => passVlidator()}
              placeholder="Password"
              placeholderTextColor="#ccc"
              autoCapitalize="none"
              secureTextEntry={passwordState}
            />
            <Icon style={styles.searchIcon} name={icon} size={20} color="#000" onPress={() => changeIcon()} />
          </View>
          <Text style={{ color: 'red', marginLeft: 15 }}>{passwordError}</Text>
          <TouchableOpacity onPress={() => { props.navigation.navigate('ForgotPassword'); }}>
            <Text style={{ color: '#AAA', fontSize: 14, marginVertical: 20, alignSelf: 'center' }}>
              Forgot Your Password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={submit} disabled={loading} style={styles.auth_btn} underlayColor="gray" activeOpacity={0.8}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnTxt}>Continue</Text>
            )}
          </TouchableOpacity>

          <Text style={{ color: '#AAA', fontSize: 14, marginVertical: 15, alignSelf: 'center',}}>
            Sign In with
          </Text>

          {Platform.OS ==='ios' && <View style={{ width: '100%', alignItems:'center', marginBottom : 20}}>
            <AppleButton 
              buttonStyle={AppleButton.Style.BLACK}
              buttonType={AppleButton.Type.CONTINUE}
              style={{
                width: 250, // You must specify a width
                height: 45, // You must specify a height
              }}
              onPress={() => onAppleButtonPress()}
            />
          </View>}
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 10, marginBottom: 10 }}>
            <TouchableOpacity onPress={facebookSignIn}>
              <Image
                style={{ width: 40, height: 40 }}
                source={require('../../assets/facebook.png')}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={googleSignIn}>
              <Image
                style={{ width: 43, height: 43 }}
                source={require('../../assets/google.png')}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <LinkedInModal
              animationType="slide"
              linkImage={require('../../assets/linkdin.png')}
              ref={linkedRef}
              renderButton={(props) => {
                return (
                  <TouchableOpacity onPress={() => linkedRef.current.open()}>
                    <Image 
                      source={require("../../assets/linkdin.png")} 
                      style={{ width: 43, height: 43 }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                )
              }}
              clientID="772vv6i0tvu4lf"
              clientSecret="kQL4XpLSa8Pmjzer"
              redirectUri="https://www.ezyfind.co.za/oauthlinkedin"
              onSuccess={token => {
                getLinkedinUser(token);
                getLinkedinUserEmailId(token);
              }}
            />
            <TouchableOpacity onPress={onLoginPress}>
              <Image
                style={{ width: 43, height: 43 }}
                source={require('../../assets/twitter.png')}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TWModal />
          </View>
          <TouchableOpacity
            style={{ marginTop: 15 }}
            activeOpacity={0.7}
            onPress={() => { props.navigation.navigate('SignUp'); }}>
            <Text style={{ color: '#CCC', alignSelf: 'center' }}>
              Dont have an account?{' '}
              <Text style={{ fontSize: 16, color: '#CCC', fontWeight: 'bold', alignSelf: 'center' }}>
                SIGN UP
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal isVisible={phoneModal}>
        <View style={{ backgroundColor: '#fff', padding: 20 }}>
          <Text>Please enter detail below</Text>
          <TextInput
            style={styles.textinput}
            onChangeText={setFname}
            underlineColorAndroid="gray"
            placeholder="FIRST NAME"
            placeholderTextColor="gray"
            value={fname}
          />
          <TextInput
            style={styles.textinput}
            onChangeText={setLname}
            underlineColorAndroid="gray"
            placeholder="LAST NAME"
            placeholderTextColor="gray"
            value={lname}
          />
          <TextInput
            style={styles.textinput}
            onChangeText={setContact}
            underlineColorAndroid="gray"
            placeholder="CONTACT NUMBER"
            placeholderTextColor="gray"
            keyboardType="number-pad"
            maxLength={10}
            value={contact}
          />
          <TextInput
            style={styles.textinput}
            onChangeText={setEmail}
            underlineColorAndroid="gray"
            placeholder="EMAIL"
            placeholderTextColor="gray"
            autoCapitalize="none"
            value={email}
          />
          
          <TouchableOpacity onPress={() => { handleSignUp(); }}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Submit</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
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
  setUserData: user => {
    dispatch({
      type: 'SET_USER',
      payload: user
    })
  },
  setUserRole : role => {
    dispatch({
      type : 'SET_USER_ROLE',
      payload: role
    })
  }
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
  textinput: {
    marginTop: 16,
    fontSize: 15,
  },

  button: {
    backgroundColor: '#db3236',
    padding: 15,
    borderRadius: 20,
    width: 220,
    marginTop: 20,
    alignSelf: 'center',
  },

  buttonText: {
    color: 'white',
    alignSelf: 'center',
  },
});
