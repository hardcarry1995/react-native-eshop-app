import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ToastAndroid, FlatList, SafeAreaView, ScrollView } from 'react-native';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import { imagePrefix } from '../../constants/utils';
import { ADD_CUSTOMER_ENQUIRY, GET_MAGAZINES_LIST, GET_SPECIAL_LIST_BY_COMPANY } from '../../constants/queries'
import client from '../../constants/client';
import { GetRating } from '../../components/GetRating';

const WhiteHouse = ({ navigation, route }) => {
  const [rating, setRating] = useState("2");
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
  const [magazine, setMagazine] = useState([]);
  const [specialdata, setSpecial] = useState([]);
  const data = route.params.detail;
  const datego = moment(data.joinDate).format('DD MMM YYYY');

  const starImageFilled =
    'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_filled.png';
  const starImageCorner =
    'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_corner.png';

  useEffect(() => {
    fetchToken();
  }, [])

  const fetchToken = async () => {
    let token = await AsyncStorage.getItem('userToken');
    fetchProducts(token);
    fetchSpecial(token);
  }

  const EmptyListMessage = (item) => {
    return (
      <Text
        style={{
          color: '#232323',
          fontSize: 18,
          padding: 15,
          marginTop: -20,
          opacity: 0.7,
        }}>
        {item}
      </Text>
    );
  };
  const fetchProducts = async (token) => {
    let variablesData = {
      id: data.companyId,
    }
    client
      .query({
        query: GET_SPECIAL_LIST_BY_COMPANY,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        variables: {
          id: data.companyId,
        },
      })

      .then(async result => {
        setSpecial(result.data.getMstSpecialList.result)
      })
      .catch(err => {
        console.log(err);
      });
  }
  const fetchSpecial = async (token) => {
    client
      .query({
        query: GET_MAGAZINES_LIST,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        variables: {
          id: data.companyId,
        },
      })

      .then(async result => {
        setMagazine(result.data.getMagazinesList.result)
      })
      .catch(err => {
        console.log(err);
      });
  }

  const nagotiatePrice = async (item) => {
    let token = await AsyncStorage.getItem('userToken');
    client
      .mutate({
        mutation: ADD_CUSTOMER_ENQUIRY,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        variables: {
          companyId: item.companyId,
          enquiryDescription: item.compCityName,
          title: item.companyName,
        },
      })
      .then(result => {
        if (result.data.addCustomerEnquiry.success) {
          Alert.alert('Success', result.data.addCustomerEnquiry.message)
        } else {
          ToastAndroid.show(
            result.data.getMstSpecialList.message,
            ToastAndroid.SHORT,
          );
        }
      })
      .catch(err => {
        console.log(err);
      });

  }

  const renderItemSpecial = ({ item, index }) => (
    <View key={index}>
      <TouchableOpacity activeOpacity={0.9}
        onPress={() => { navigation.navigation('Special', { detail: item }); }}>
        <View style={styles.mainGet}>
          <View style={{ width: "22%", justifyContent: "center" }}>
            <Image
              style={styles.image}
              source={item.logoPath ? { uri: `${imagePrefix}${item.logoPath}` } : require('../../assets/NoImage.jpeg')}
            />
          </View>

          <View style={{ width: "0.5%", backgroundColor: '#D0D0D0', height: "80%", alignSelf: "center" }} />
          <View style={{ width: "77%" }}>
            <Text style={styles.text} numberOfLines={1}>
              {item.specialName}
            </Text>
            <GetRating companyId={item.itemRequestID} onprogress={(Rating) => setRating(Rating)} />
            <View style={{ flexDirection: "row", margin: 10 }}>
              {maxRating.map((item, key) => {
                return (
                  <TouchableOpacity activeOpacity={0.7} key={key} >
                    <Image
                      style={styles.starImageStyleNew}
                      source={item <= rating ? { uri: starImageFilled } : { uri: starImageCorner }}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={{ color: '#A8A8A8', fontSize: 11, marginLeft: 10 }}>
              {moment(item.startDate).format('DD-MMM-YYYY')}
            </Text>
            <Text numberOfLines={1} style={{ color: '#323232', fontSize: 11, marginLeft: 10 }}>
              {item.specialDescription}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item, index }) => (
    <View key={index}>
      <TouchableOpacity activeOpacity={0.9} onPress={() => { navigation.navigate('Catalogue36', { detail: item }); }}>
        <View style={styles.mainGet}>
          <View style={{ width: "22%", justifyContent: "center" }}>
            <Image
              style={styles.image}
              source={item.logoPath ? { uri: `${imagePrefix}${item.logoPath}` } : require('../../assets/NoImage.jpeg')}
            />
          </View>
          <View style={{ width: "0.5%", backgroundColor: '#D0D0D0', height: "80%", alignSelf: "center" }} />
          <View style={{ width: "77%" }}>
            <Text style={styles.text} numberOfLines={1}>
              {item.magazineName}
            </Text>
            <GetRating companyId={item.itemRequestID} onprogress={(Rating) => setRating(Rating)} />
            <View style={{ flexDirection: "row", margin: 10 }}>
              {maxRating.map((item, key) => {
                return (
                  <TouchableOpacity activeOpacity={0.7} key={key}>
                    <Image
                      style={styles.starImageStyleNew}
                      source={item <= rating ? { uri: starImageFilled } : { uri: starImageCorner }}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text
              style={{
                color: '#A8A8A8',
                fontSize: 11,
                marginLeft: 10
              }}>
              {moment(item.startDate).format('DD-MMM-YYYY')}
            </Text>
            <Text numberOfLines={1}
              style={{
                color: '#323232',
                fontSize: 11,
                marginLeft: 10
              }}>
              {item.eFlyerDescription}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <Image
            style={styles.image1}
            source={data.logoPath ? { uri: `${imagePrefix}${data.logoPath}` } : require('../../assets/NoImage.jpeg')}
          />
          <View style={{}}>
            <View style={styles.main}>
              <View>
                <Text style={{ color: '#9F1D20', fontSize: 21, padding: 15 }}>
                  {data.companyName}
                </Text>
                <Text style={{ color: '#232323', marginLeft: 15, fontSize: 15 }}>
                  Address
                </Text>
                <Text
                  style={{ marginLeft: 80, marginTop: -20, color: '#C9C9C9' }}>
                  {data.compStreetAddress} {data.compCityName} {data.compCountryName}
                </Text>
                <Text style={{ color: '#232323', marginLeft: 15, fontSize: 15, marginTop: 20 }}>
                  Registered Date
                </Text>
                <Text style={{ color: '#C9C9C9', marginLeft: 130, fontSize: 15, marginTop: -20 }}>
                  {datego}
                </Text>
                <Text style={{ color: '#232323', marginLeft: 15, fontSize: 15, marginTop: 18 }}>
                  Status
                </Text>
                <Text style={{ color: '#2CD826', marginLeft: 75, fontSize: 15, marginTop: -20 }}>
                  {data.companyStatus}
                </Text>
              </View>
            </View>
          </View>

          <View style={{ marginTop: 10 }}>
            <View style={styles.main2}>
              <View>
                <Text style={{ color: '#9F1D20', fontSize: 21, padding: 15 }}>
                  Contact Information
                </Text>
                <Text style={{ color: '#232323', marginLeft: 15, fontSize: 15 }}>
                  Phone
                </Text>
                <Text
                  style={{ marginLeft: 80, marginTop: -20, color: '#C9C9C9' }}>
                  {data.compPhone}
                </Text>
                <Text style={{ color: '#232323', marginLeft: 15, fontSize: 15, marginTop: 20 }}>
                  Fax
                </Text>
                <Text style={{ color: '#232323', marginLeft: 15, fontSize: 15, marginTop: 18 }}>
                  Website
                </Text>
                <Text
                  style={{ marginLeft: 80, marginTop: -20, color: '#C9C9C9' }}>
                  {data.compWebSite}
                </Text>
                <Text style={{ color: '#232323', marginLeft: 15, fontSize: 15, marginTop: 18 }}>
                  Email
                </Text>
                <Text
                  style={{ marginLeft: 80, marginTop: -20, color: '#C9C9C9' }}>
                  {data.compEmailId}
                </Text>
                <Text style={{ color: '#232323', marginLeft: 15, fontSize: 15, marginTop: 18 }}>
                  Helpline Number
                </Text>
                <Text
                  style={{ marginLeft: 150, marginTop: -20, color: '#C9C9C9' }}>
                  {data.compHelpDeskNumber}
                </Text>
                <Text style={{ color: '#232323', marginLeft: 15, fontSize: 15, marginTop: 18 }}>
                  Help Desk
                </Text>
                <TouchableOpacity onPress={() => { nagotiatePrice(data); }}
                  style={{
                    height: 35,
                    width: 130,
                    backgroundColor: '#9F1D20',
                    alignSelf: 'center',
                    marginTop: 25,
                    borderRadius: 5,
                  }}>
                  <Text style={{ alignSelf: 'center', marginTop: 8, color: '#FFFFFF', fontSize: 15, }}>
                    Contact Now
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={{}}>
            <View style={styles.main3}>
              <View>
                <Text style={{ color: '#9F1D20', fontSize: 21, alignSelf: 'center', marginTop: 10 }}>
                  Rating
                </Text>
                <GetRating companyId={data.companyId} onprogress={(Rating) => { setRating(Rating); }} />
                <Text style={{ color: '#CFCFCF', fontSize: 35, alignSelf: 'center', opacity: 0.5, }}>
                  {rating}
                </Text>
                <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 5 }}>
                  {maxRating.map((item, key) => {
                    return (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        key={item}
                      >
                        <Image
                          style={styles.starImageStyle}
                          source={item <= rating ? { uri: starImageFilled } : { uri: starImageCorner }}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <TouchableOpacity
                  style={{
                    height: 35,
                    width: 130,
                    backgroundColor: '#9F1D20',
                    alignSelf: 'center',
                    marginTop: 20,
                    borderRadius: 5,
                  }}
                  onPress={() => {
                    navigation.navigate('RateandReview', { detail: data, type: 2 });
                  }}>
                  <Text style={{ alignSelf: 'center', marginTop: 8, color: '#FFFFFF', fontSize: 15 }}>
                    Give Rating
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={{}}>
            <View style={styles.main4}>
              <View>
                <Text style={{ color: '#9F1D20', fontSize: 21, padding: 15 }}>
                  Specials
                </Text>
                <FlatList
                  ListEmptyComponent={EmptyListMessage('No special found')}
                  data={specialdata}
                  keyExtractor={(item, i) => i}
                  renderItem={renderItemSpecial}
                />
              </View>
            </View>
          </View>

          <View style={{ marginBottom: 30 }}>
            <View style={styles.main5}>
              <View>
                <Text style={{ color: '#9F1D20', fontSize: 21, padding: 15 }}>
                  Magazines
                </Text>
                <FlatList
                  ListEmptyComponent={EmptyListMessage('No magazine found')}
                  data={magazine}
                  keyExtractor={(item, i) => i}
                  renderItem={renderItem}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  main: {
    // height: 225,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowRadius: 20,
    elevation: 8,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 20,
    paddingBottom: 20,
  },
  image: {
    height: 64,
    width: 64,
    marginTop: 17,
    marginLeft: 10,
  },
  text: {
    marginLeft: 110,
    bottom: 70,
    color: '#323232',
  },
  main2: {
    height: 360,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowRadius: 20,
    elevation: 8,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 20,
  },
  main3: {
    height: 215,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowRadius: 20,
    elevation: 8,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 20,
  },
  main4: {
    height: 105,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowRadius: 20,
    elevation: 8,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 20,
  },
  main5: {
    // height: 105,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowRadius: 20,
    elevation: 8,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 20,
  },
  mainm: {
    height: 100,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowRadius: 20,
    elevation: 8,
    marginLeft: 16,
    marginRight: 16,
    // marginTop: 20,
    flexDirection: "row",
    marginBottom: 10
  },
  image: {
    height: 40,
    width: 64,
    marginLeft: 10,
  },
  text: {
    marginLeft: 10,
    color: '#323232',
  },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#F54D30',
    height: 43,
    borderRadius: 5,
    margin: 15,
  },

  ImageStyle: {
    padding: 10,
    margin: 5,
    height: 20,
    width: 20,
    resizeMode: 'stretch',
    alignItems: 'center',
  },
  image1: {
    height: 190,
    // width: 360,
    alignContent: 'center',
    resizeMode: 'stretch'
  },
  // starImageStyle: {
  //   width: 20,
  //   height: 20,
  // },
  starImageStyle: {
    width: 30,
    height: 30,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  starImageStyleNew: {
    width: 15,
    height: 15,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  mainGet: {
    height: 100,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowRadius: 20,
    elevation: 8,
    marginLeft: 6,
    marginRight: 6,
    marginTop: 2,
    marginBottom: 10,
    flexDirection: "row",
  },
});


export default WhiteHouse;
