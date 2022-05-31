import React, { useState, useEffect, useCallback } from 'react';
import CheckBox from 'react-native-check-box';
import { StyleSheet, Text, Platform, SafeAreaView, ScrollView, View, Alert, Linking, TextInput, ToastAndroid, Button, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MAIN_CATEGORY, GET_PROVINCE, GET_CITY, GET_SUBURB, HANDLE_SIGNUP_BUSINESS, CHECK_MAIL } from '../../constants/queries';
import AsyncStorage from '@react-native-community/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import client from '../../constants/client';
import { encode, decode } from 'base-64';
import Geolocation from '@react-native-community/geolocation';
import { gql } from '@apollo/client';

const HANDLE_LOGIN = gql`
 query login(
    $token: String
  ) {
    sSOLogin(jti:$token) {
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

const Companyinfo = ({ navigation, ...props }) => {
  const [selectedValue, setSelectedValue] = useState('');
  const [catData, setCatData] = useState([]);
  const [province, setProvince] = useState([]);
  const [selectProvince, setSelectProvince] = useState('');
  const [city, setCity] = useState([]);
  const [selectCity, setSelectCity] = useState('');
  const [suburb, setSuburb] = useState([]);
  const [selectSub, setSelectSub] = useState('');
  const [termCheck, setTermCheck] = useState(false);
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [companyName, setcompanyName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLogitude] = useState('');
  const [loading, setLoading] = useState(false);

  const data = props.route.params.detail;
  const itemOff = props.route.params.itemOff;

  useEffect(() => {
    getAllCategory();
    fetchProvince();
    getLocation();
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleOpenURL(url)
      }
    }).catch(err => {
    })
    Linking.addEventListener('url', handleOpenURL)
  });

  const getLocation = () => {
    Geolocation.getCurrentPosition((position) => {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      setLatitude(latitude);
      setLogitude(longitude);
    }, (error) => {
      Alert.alert('Please on location',error.message)
    },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 100000
      });
  }
  const openGateWay = async () => {
    // const { addNewOrderGatewayToken } = this.props
    let urlData = "https://sandbox.payfast.co.za/eng/process?merchant_id=10001460&merchant_key=0j4uaurpqk87v&return_url=https%3a%2f%2fwww.LawyersEzyFind.co.za%2fLCPayFastReturn.html&cancel_url=https%3a%2f%2fwww.LawyersEzyFind.co.za%2fLCPayFastCancel.html&notify_url=http%3a%2f%2fmobileapiv2.ezyfind.co.za%2fapi%2fUser%2fNotify%3f&m_payment_id=13223&amount=165000.00&item_name=fabtcy409+Company&item_description=Purchased+EzyFindMobileApi.Model.MstPackage+Package&subscription_type=1&recurring_amount=165000.00&frequency=4&cycles=0";
    const url = urlData
    const canOpen = await Linking.canOpenURL(url)
    if (canOpen) {
      // props.dispatch(setPaymentStatus('checked'))
      Linking.openURL(url)
    }
  }
  // handle gateway callbacks
  const handleOpenURL = async (url) => {
    if (isSucceedPayment(url)) { // your condition
      // handle success payment
      console.log('handle success payment')
    } else {
      // handle failure
      console.log('handle failure payment')
    }
  }
  const fetchProvince = async () => {
    let token = await AsyncStorage.getItem('userToken');
    client
      .query({
        query: GET_PROVINCE,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      })
      .then(async result => {
        if (result.data.getProvince.success) {
          setProvince(result.data.getProvince.result);
        } else {
          alert(result.data.getProvince.message);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const fetchCity = async id => {
    if (id === '') {
      return;
    }
    let token = await AsyncStorage.getItem('userToken');
    client
      .query({
        query: GET_CITY,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        variables: {
          id: Number(id),
        },
      })
      .then(async result => {
        if (result.data.getCityByProvince.success) {
          setCity(result.data.getCityByProvince.result);
        } else {
          alert(result.data.getCityByProvince.message);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const fetchSuburb = async id => {
    if (id === '') {
      return;
    }
    let token = await AsyncStorage.getItem('userToken');
    client
      .query({
        query: GET_SUBURB,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        variables: {
          id: Number(id),
        },
      })
      .then(async result => {
        // console.log(result);
        if (result.data.getSuburbByCity.success) {
          setSuburb(result.data.getSuburbByCity.result);
        } else {
          alert(result.data.getSuburbByCity.message);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  const checkEmailExist = async () => {
    let token = await AsyncStorage.getItem('userToken');
    try {
      let result = await client.query({
        query: CHECK_MAIL,
        fetchPolicy: 'network-only',
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
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
  const handleSignUpBusiness = async () => {
    setLoading(true);
    let token = await AsyncStorage.getItem('userToken');
    if (companyName == '') {
      alert('Please enter company name');
      setLoading(false);
      return;
    }
    if (selectedValue == '') {
      alert('Please select category');
      setLoading(false);
      return;
    }
    if (mobile.length < 10) {
      alert('Please enter valid contact');
      setLoading(false);
      return;
    }
    let rjx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let isValid = rjx.test(email);
    if (!isValid) {
      alert('Please enter valid email');
      setLoading(false);
      return;
    }
    if (password !== cpassword) {
      alert('Password does not match');
      setLoading(false);
      return;
    }
    if (password == '') {
      alert('Please enter company name');
      setLoading(false);
      return;
    }
    if (selectProvince == '') {
      alert('Please select province ');
      setLoading(false);
      return;
    }
    if (selectCity == '') {
      alert('Please select city ');
      setLoading(false);
      return;
    }
    if (selectSub == '') {
      alert('Please select suburb');
      setLoading(false);
      return;
    }
    if (email === '' || password === '' || cpassword === '' || mobile === '' || fname === '' || lname === '') {
      alert('Please enter all details');
      setLoading(false);
      return;
    }
    let isEmailExist = await checkEmailExist();
    if (isEmailExist) {
      alert("Email already exists");
      setLoading(false);
      return;
    }
    let isPlatform = 1;
    if (Platform.OS == 'android') {
      isPlatform = 1;
    }
    else if (Platform.OS == 'ios') {
      isPlatform = 2;
    } else {
      isPlatform = 3;
    }
    const fcm_token = await AsyncStorage.getItem('fcm_token');
    client
      .mutate({
        mutation: HANDLE_SIGNUP_BUSINESS,
        fetchPolicy: 'no-cache',
        variables: {
          name: fname,
          lname: lname,
          email: email,
          contactNo: mobile,
          password: password,
          companyName: companyName,
          categoryId: selectedValue,
          provinceID: Number(selectProvince),
          cityID: selectCity,
          suburbID: selectSub,
          packageID: data.packageID,
          deviceId: fcm_token,
          deviceType: 1,
          latitude: latitude.toString(),
          longitude: longitude.toString()
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
        if (result.data.registerBusiness.success) {
          navigation.push('WebPayment', { url: result.data.registerBusiness.result.paymentUrl, email: email, password: password });
        } else {
          alert(result.data.registerBusiness.message);
        }
      })
      .catch(err => {
        setLoading(false);
        console.log('handleSignUp', err);
      });
  }

  const submit = async () => {
    let token = await AsyncStorage.getItem('userToken');
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
            tokenData: `${encode(token)}`,
          },
        },
      })
      .then(async result => {
        console.log('Login response >>>>', result);

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
          // this.props.setUserToken(result.data.sSOLogin.result.token);
          navigation.navigate('AuthLoading');
        } else {
          alert(result.data.sSOLogin.message);
        }
      })
      .catch(err => {
        // this.setState({ loading: false });
        console.log('Login api', err);
      });
  }

  const getAllCategory = async () => {
    let token = await AsyncStorage.getItem('userToken');
    client
      .query({
        query: MAIN_CATEGORY,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
            // 'Content-Length': 0,
          },
        },
      })
      .then(async result => {
        if (result.data.getMstCategoryMain.success) {
          setCatData(result.data.getMstCategoryMain.result.map(item => ({ label : item.categoryName, value: item.categoryId })));
        } else {
          alert(result.data.getMstCategoryMain.message);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View>
          <Text style={{ fontSize: 20, color: '#373737', marginTop: 20 }}>
            Company Info
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderRadius: 10,
              height: 41,
              borderColor: '#E22727',
              marginTop: 15,
              paddingLeft: 10
            }}
            onChangeText={text => setcompanyName(text)}
            placeholder="Enter Company Name"
            placeholderTextColor="gray"
          />

          <View
            style={{
              borderRadius: 10,
              borderColor: '#E22727',
              borderWidth: 1,
              height: 50,
              marginTop: 15,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <RNPickerSelect
              value={selectedValue}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedValue(itemValue)
              }
              items={catData}
              textInputProps={styles.pickerContainer}
            />
          </View>

          <View
            style={{
              height: 1,
              opacity: 0.3,
              backgroundColor: 'grey',
              marginTop: 30,
              marginRight: 15,
              marginLeft: 15,
            }}
          />

          <Text style={{ fontSize: 20, color: '#373737', marginTop: 20 }}>
            Basic User Info
          </Text>

          <TextInput
            onChangeText={text => setFname(text)}
            style={{
              borderWidth: 1,
              borderRadius: 10,
              height: 41,
              borderColor: '#E22727',
              marginTop: 15,
              paddingLeft: 10
            }}
            placeholder="First Name"
            placeholderTextColor="gray"
          />

          <TextInput
            onChangeText={text => setLname(text)}
            style={{
              borderWidth: 1,
              borderRadius: 10,
              height: 41,
              borderColor: '#E22727',
              marginTop: 15,
              paddingLeft: 10
            }}
            placeholder="Last Name"
            placeholderTextColor="gray"
          />
          <TextInput
            onChangeText={text => setMobile(text)}
            style={{
              borderWidth: 1,
              borderRadius: 10,
              height: 41,
              borderColor: '#E22727',
              marginTop: 15,
              paddingLeft: 10
            }}
            placeholder="Mobile Number"
            keyboardType="number-pad"
            maxLength={10}
            placeholderTextColor="gray"
          />
          <TextInput
            onChangeText={text => setEmail(text)}
            style={{
              borderWidth: 1,
              borderRadius: 10,
              height: 41,
              borderColor: '#E22727',
              marginTop: 15,
              paddingLeft: 10
            }}
            placeholder="Email"
            placeholderTextColor="gray"
          />
          <TextInput

            onChangeText={text => setPassword(text)}
            style={{
              borderWidth: 1,
              borderRadius: 10,
              height: 41,
              borderColor: '#E22727',
              marginTop: 15,
              paddingLeft: 10
            }}
            placeholder="Password"
            placeholderTextColor="gray"
          // secureTextEntry={true}
          />
          <TextInput
            onChangeText={text => setCPassword(text)}
            style={{
              borderWidth: 1,
              borderRadius: 10,
              height: 41,
              borderColor: '#E22727',
              marginTop: 15,
              paddingLeft: 10
            }}
            placeholder="Confirm Password"
            placeholderTextColor="gray"
          />

          <View
            style={{
              height: 1,
              opacity: 0.3,
              backgroundColor: 'grey',
              marginTop: 30,
              marginRight: 15,
              marginLeft: 15,
            }}
          />

          <Text style={{ fontSize: 20, color: '#373737', marginTop: 20 }}>
            Area Info
          </Text>

          <View
            style={{
              borderRadius: 10,
              borderColor: '#E22727',
              borderWidth: 1,
              height: 50,
              marginTop: 15,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <RNPickerSelect
              value={selectProvince}
              onValueChange={(itemValue, itemIndex) =>{
                setSelectProvince(itemValue);
                fetchCity(itemValue);
              }}
              placeholder= {{ label: "Select a Province...", value: null }}
              items={province.map((item, i) => ({ label: item.provinceName, value: item.provinceId }))}
              textInputProps={styles.pickerContainer}
            />
          </View>

          <View
            style={{
              borderRadius: 10,
              borderColor: '#E22727',
              borderWidth: 1,
              height: 50,
              marginTop: 15,
              justifyContent:'center',
              alignItems: 'center'
            }}>
            <RNPickerSelect
              value={selectCity}
              onValueChange={(itemValue, itemIndex) =>{
                setSelectCity(itemValue);
                fetchSuburb(itemValue);
              }}
              placeholder= {{ label: "Select a City...", value: null }}
              items={city.map((item, i) => ({ label: item.cityName, value: item.cityId }))}
              textInputProps={styles.pickerContainer}
            />
            
          </View>

          <View
            style={{
              borderRadius: 10,
              borderColor: '#E22727',
              borderWidth: 1,
              height: 50,
              marginTop: 15,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <RNPickerSelect
              value={selectSub}
              onValueChange={(itemValue, itemIndex) =>{
                setSelectSub(itemValue);
              }}
              placeholder= {{ label: "Select a Sub...", value: null }}
              items={suburb.map((item, i) => ({ label: item.suburbName, value: item.suburbId }))}
              textInputProps={styles.pickerContainer}
            />
          </View>
          <View style={{ marginTop: 15 }}>
            <CheckBox
              isChecked={termCheck}
              onClick={() => {
                setTermCheck(!termCheck);
              }}
            />

            <Text
              style={{
                marginLeft: 39,
                bottom: 22,
                fontSize: 19,
                color: 'grey',
                opacity: 0.7,
              }}>
              I agree that the information provided above is true to my knowledge
              and accept the terms & conditions.
            </Text>
          </View>
          <View style={{ padding: 10, marginBottom: 20, marginStart: 30, marginEnd: 30 }}>
            <TouchableOpacity
              onPress={() => {
                handleSignUpBusiness();
              }}
              style={{
                backgroundColor: '#9F1D20',
                padding: 10,
                borderRadius: 10,
                height: 35,
              }}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: '#FFFFFF', alignSelf: 'center', bottom: 3 }}>
                  Proceed
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ecf0f1',
  },
  pickerContainer: {
    textAlign: 'center',
    color: 'red',
    fontSize: 18
  },
});
export default Companyinfo;
