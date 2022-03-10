import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  ToastAndroid
} from 'react-native';
import { GIVE_BUSINESS_RATING } from '../../constants/queries';
import client from '../../constants/client';
import AsyncStorage from '@react-native-community/async-storage';
import { Alert } from 'react-native';

const RateandReview = ({ navigation, route }) => {
  const [userdata, setDataUser] = useState('');
  const [userdataInfo, setDataUserInfo] = useState([]);
  const [rating, setRating] = useState("");
  const [name_address, setname_address] = useState('');
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
  const data = route.params.detail;
  const type = route.params.type;

  const starImageFilled =
    'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_filled.png';
  const starImageCorner =
    'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_corner.png';


  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    let info = await AsyncStorage.getItem('userInfo');
    let token = await AsyncStorage.getItem('userToken');
    const more_info = JSON.parse(info);
    setDataUser(token)
    setDataUserInfo(more_info);
  }
  const getDataUsingPost = () => {
    let id = 0
    let companyIdGo = 0
    let specialIdGo = 0
    let eflyerIdGo = 0
    if (type === 1) {
      id = data.specialID
      companyIdGo = data.companyIds
      specialIdGo = data.specialID
      eflyerIdGo = 0
    }
    if (type === 2) {
      id = data.companyId
      companyIdGo = data.companyId
      specialIdGo = 0
      eflyerIdGo = 0
    }
    if (type === 3) {
      id = data.eflyerId
      companyIdGo = data.companyId
      specialIdGo = 0
      eflyerIdGo = data.eflyerId
    }
    let variablesdata = {
      companyId: companyIdGo,
      specialId: specialIdGo,
      eflyerId: eflyerIdGo,
      ratingScore: rating * 10,
      reviewData: name_address,
      userId: Number(userdataInfo?.id)
    }
    console.log('variablesdata', variablesdata)
    client
      .mutate({
        mutation: GIVE_BUSINESS_RATING,
        // fetchPolicy: 'no-cache',
        variables: {
          companyId: companyIdGo,
          specialId: specialIdGo,
          eflyerId: eflyerIdGo,
          ratingScore: rating * 10,
          reviewData: name_address,
          userId: Number(userdataInfo?.id)
        },
        context: {
          headers: {
            Authorization: `Bearer ${userdata}`,
          }
        },
      })
      .then(result => {
        console.log('result-----------', result);
        if (result.data.postMstRating.success) {
          // ToastAndroid.show(
          //   result.data.postMstRating.message,
          //   ToastAndroid.SHORT
          // );
          Alert.alert("Success", result.data.postMstRating.message)
          navigation.goBack();
        } else {
          ToastAndroid.show(
            result.data.postMstRating.message,
            ToastAndroid.SHORT,
          );
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <View>
            <Image
              style={{ height: 190, width: 360, alignSelf: 'center' }}
              source={require('../../assets/home29.png')}
            />
          </View>
          <View>
            {type === 1 &&
              <Text
                style={{
                  color: '#9F1D20',
                  fontSize: 21,
                  padding: 25,
                  alignSelf: 'center',
                }}>

                {data.specialName}
              </Text>
            }
            {type === 2 &&
              <Text
                style={{
                  color: '#9F1D20',
                  fontSize: 21,
                  padding: 25,
                  alignSelf: 'center',
                }}>

                {data.companyNam}
              </Text>
            }
            {type === 3 &&
              <Text
                style={{
                  color: '#9F1D20',
                  fontSize: 21,
                  padding: 25,
                  alignSelf: 'center',
                }}>

                {data.magazineName}
              </Text>
            }
            {/* <Image
              style={{
                height: 30,
                width: 173,
                alignSelf: 'center',
                marginTop: -5,
              }}
              source={require('../assets/G29.png')}
            /> */}
            <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 5 }}>
              {maxRating.map((item, key) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    key={item}
                    onPress={() => setRating(item)}
                  >
                    <Image
                      style={styles.starImageStyle}
                      source={
                        item <= rating
                          ? { uri: starImageFilled }
                          : { uri: starImageCorner }
                      }
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <View style={{}}>
            <View style={styles.main}>
              <TextInput
                placeholder="Write a review.."
                multiline={true}
                style={{ paddingLeft: 10 }}
                value={name_address}
                onChangeText={name_address => setname_address(name_address)}
              // numberOfLines={5}
              />
              {/* <View>
                <Text
                  style={{
                    color: '#C1BFBF',
                    fontSize: 21,
                    padding: 15,
                    opacity: 0.5,
                  }}>
                  Write a review..
                </Text>
              </View> */}
            </View>
          </View>

          <TouchableOpacity onPress={() => {
            getDataUsingPost();
          }}
            style={{
              height: 35,
              width: 130,
              backgroundColor: '#9F1D20',
              alignSelf: 'center',
              marginTop: 50,
              borderRadius: 5,
              marginBottom: 30
            }}>
            <Text
              style={{
                alignSelf: 'center',
                marginTop: 8,
                color: '#FFFFFF',
                fontSize: 15,
              }}>
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: {
    height: 200,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowRadius: 20,
    elevation: 2,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 50,
  },
  starImageStyle: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
});

export default RateandReview;
