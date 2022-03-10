import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ScrollView,
  Alert,
  ToastAndroid
} from 'react-native';
import Moment from 'moment';
import { imagePrefix } from '../../constants/utils';
import { GET_MAGAZINES_LIST, ADD_CUSTOMER_ENQUIRY } from '../../constants/queries';
import AsyncStorage from '@react-native-community/async-storage';
import client from '../../constants/client';
import { GetRating } from '../../components/GetRating';

const Catalogue36 = ({ navigation, route }) => {
  const detailData = route.params.detail;
  const dateDMY = Moment(detailData.startDate).format('DD-MMM-YYYY');
  const [magazinData, setMagazine] = useState([]);
  const [rating, setRating] = useState('2');
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
  const [starImageFilled, setstarImageFilled] = useState('https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_filled.png');
  const [starImageCorner, setstarImageCorner] = useState('https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_corner.png');

  useEffect(() => {
    fetchToken();
  }, []);

  const fetchToken = async () => {
    let token = await AsyncStorage.getItem('userToken');
    fetchProducts(token);
  }

  const fetchProducts = async (token) => {
    // console.log(' GET_MAGAZINES_LIST detailData', detailData);
    client
      .query({
        query: GET_MAGAZINES_LIST,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
            // 'Content-Length': 0,
          },
        },
        variables: {
          id: detailData.companyId,
        },
      })
      .then(result => {
        // console.log(' GET_SPECIAL_BY_ID datakkkkkkkkk', result.data.getMagazinesList.result);
        // if (result.data.getMagazinesList.result.length >0) {
        setMagazine(result.data.getMagazinesList.result);
        // } else {
        //   ToastAndroid.show(
        //     result.data.getMagazinesList.message,
        //     ToastAndroid.SHORT,
        //   );
        // }
      })
      .catch(err => {
        console.log(err);
      });
  }

  const nagotiatePrice = async (item) => {
    let token = await AsyncStorage.getItem('userToken');
    console.log('item', item)
    client
      .mutate({
        mutation: ADD_CUSTOMER_ENQUIRY,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
            // 'Content-Length': 0,
          },
        },
        variables: {
          companyId: item.companyId,
          enquiryDescription: item.eFlyerDescription,
          title: item.magazineName,
        },
      })
      .then(result => {
        // console.log(' ADD_CUSTOMER_ENQUIRY ADD_CUSTOMER_ENQUIRY', result);
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
  const renderItem = ({ item, index }) => (
    <View style={{ marginBottom: 10 }}>
      {detailData.eflyerId !== item.eflyerId &&
        <TouchableOpacity
          // activeOpacity={0.9}
          onPress={() => {
            // this.props.navigation.navigate('Special', { data: item });
          }}>
          <View style={styles.maint}>
            <View style={{ width: "22%", justifyContent: "center" }}>
              <Image
                style={styles.imaget}
                source={item.itemImagePath
                  ?
                  { uri: `${imagePrefix}${item.mapEflyersUploadDtos[0].documentName}` }
                  :
                  require('../../assets/NoImage.jpeg')}
              />
            </View>

            <View
              style={{
                width: "0.5%",
                backgroundColor: '#fff',
                height: "80%",
                alignSelf: "center"
              }}
            />

            <View style={{ width: "77%" }}>

              <Text style={styles.textt}>
                {item.magazineName}
              </Text>
              <GetRating companyId={item.itemRequestID} onprogress={(Rating) => setRating(Rating)} />
              <View style={{ flexDirection: "row", margin: 10 }}>
                {maxRating.map((item, key) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      key={item}
                    >
                      <Image
                        style={styles.starImageStyle2}
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

              <Text
                style={{
                  color: '#A8A8A8',
                  fontSize: 11,
                  marginLeft: 10
                }}>
                {Moment(item.startDate).format('DD-MMM-YYYY')}
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
      }
      {magazinData.length === 1 &&
        <Text
          style={{
            color: '#232323',
            fontSize: 18,
            padding: 15,
            marginTop: -20,
            opacity: 0.7,
          }}>
          No magazin found
        </Text>
      }
    </View>
  );

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


  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <View>
            {/* <Image
              style={{height: 190, width: 360, alignSelf: 'center'}}
              source={require('../assets/C36.png')}
            /> */}
            <Image
              style={{ height: 190, width: 360, alignSelf: 'center' }}
              source={detailData.itemImagePath
                ?
                { uri: `${imagePrefix}${detailData.mapEflyersUploadDtos[0].documentName}` }
                :
                require('../../assets/NoImage.jpeg')}
            />
          </View>
          <View style={{}}>
            <View style={styles.main}>
              <View>
                <Text style={{ color: '#9F1D20', fontSize: 21, padding: 15 }}>
                  {detailData.magazineName}
                </Text>
                <Text style={{ color: '#232323', marginLeft: 15, fontSize: 15 }}>
                  Company Name
                </Text>
                <Text
                  style={{ marginLeft: 135, marginTop: -20, color: '#C9C9C9' }}>
                  {detailData.companyName}
                </Text>
                <Text
                  style={{
                    color: '#232323',
                    marginLeft: 15,
                    fontSize: 15,
                    marginTop: 20,
                  }}>
                  Address
                </Text>
                <Text
                  style={{
                    color: '#C9C9C9',
                    marginLeft: 100,
                    fontSize: 15,
                    marginTop: -20,
                  }}>
                  {detailData.companyLocation}
                </Text>
                <Text
                  style={{
                    color: '#232323',
                    marginLeft: 15,
                    fontSize: 15,
                    marginTop: 18,
                  }}>
                  Start Date
                </Text>
                <Text
                  style={{
                    color: '#C9C9C9',
                    marginLeft: 95,
                    fontSize: 15,
                    marginTop: -20,
                  }}>
                  {Moment(detailData.startDate).format('DD-MMM-YYYY')}
                </Text>
                <Text
                  style={{
                    color: '#232323',
                    marginLeft: 15,
                    fontSize: 15,
                    marginTop: 18,
                  }}>
                  End Date
                </Text>
                <Text
                  style={{
                    color: '#C9C9C9',
                    marginLeft: 95,
                    fontSize: 15,
                    marginTop: -20,
                  }}>
                  {Moment(detailData.endDate).format('DD-MMM-YYYY')}
                </Text>
                <Text
                  style={{
                    color: '#232323',
                    marginLeft: 15,
                    fontSize: 15,
                    marginTop: 18,
                  }}>
                  Description
                </Text>
                <Text numberOfLines={4}
                  style={{
                    color: '#C9C9C9',
                    marginLeft: 15,
                    fontSize: 15,
                    marginTop: -2,
                  }}>
                  {detailData.eFlyerDescription}
                </Text>
              </View>
            </View>
          </View>

          <View style={{ marginTop: 10 }}>
            <View style={styles.main2}>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    nagotiatePrice(detailData);
                  }}
                  style={{
                    height: 35,
                    width: 239,
                    backgroundColor: '#9F1D20',
                    alignSelf: 'center',
                    marginTop: 25,
                    borderRadius: 5,
                  }}>
                  <Text
                    style={{
                      alignSelf: 'center',
                      marginTop: 8,
                      color: '#FFFFFF',
                      fontSize: 15,
                    }}>
                    Contact Business
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  // nagotiatePrice
                  onPress={() => {
                    nagotiatePrice(detailData);
                  }}
                  style={{
                    height: 35,
                    width: 239,
                    backgroundColor: '#9F1D20',
                    alignSelf: 'center',
                    marginTop: 25,
                    borderRadius: 5,
                  }}>
                  <Text
                    style={{
                      alignSelf: 'center',
                      marginTop: 8,
                      color: '#FFFFFF',
                      fontSize: 15,
                    }}>
                    Negotiate Price
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={{}}>
            <View style={styles.main3}>
              <View>
                <Text
                  style={{
                    color: '#9F1D20',
                    fontSize: 21,
                    padding: 15,
                    alignSelf: 'center',
                  }}>
                  Rating
                </Text>
                <Text
                  style={{
                    color: '#CFCFCF',
                    fontSize: 35,
                    padding: 15,
                    alignSelf: 'center',
                    marginTop: -20,
                    opacity: 0.5,
                  }}>
                  0.0
                </Text>
                {/* <Text style={{color:"#232323", marginLeft:15, fontSize:15}}>Address</Text>
                             <Text style={{marginLeft:80, marginTop:-20, color:"#C9C9C9"}}>No 39, 4th Street, Parkhurst, Johannaesburg, Parkhurst,, City of Johannesburg Metropolitan Municipality, Gauteng</Text>
                             <Text style={{color:"#232323", marginLeft:15, fontSize:15, marginTop:20}}>Registered Date</Text>
                             <Text style={{color:"#C9C9C9", marginLeft:130, fontSize:15, marginTop:-20}}>26 July 2015</Text>
                             <Text style={{color:"#232323", marginLeft:15, fontSize:15, marginTop:18}}>Status</Text>
                             <Text style={{color:"#2CD826", marginLeft:75, fontSize:15, marginTop:-20}}>Active</Text> */}
                <Image
                  style={{
                    height: 25,
                    width: 143,
                    alignSelf: 'center',
                    marginTop: -15,
                  }}
                  source={require('../../assets/G29.png')}
                />
                <TouchableOpacity
                  onPress={() => {
                    navigation.push('RateScreen', { detail: detailData, type: 3 });
                  }}
                  style={{
                    height: 35,
                    width: 130,
                    backgroundColor: '#9F1D20',
                    alignSelf: 'center',
                    marginTop: 30,
                    borderRadius: 5,
                  }}>
                  <Text
                    style={{
                      alignSelf: 'center',
                      marginTop: 8,
                      color: '#FFFFFF',
                      fontSize: 15,
                    }}>
                    Give Rating
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={{ marginBottom: 40 }}>
            <View style={styles.main4}>
              <View>
                <Text style={{ color: '#9F1D20', fontSize: 21, padding: 15 }}>
                  Other Magazines by {detailData.companyName}
                </Text>
                <FlatList
                  ListEmptyComponent={EmptyListMessage('No magazines found')}
                  data={magazinData}
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
    height: 420,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowRadius: 20,
    elevation: 8,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 20,
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
    height: 150,
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
    // height: 105,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowRadius: 20,
    elevation: 8,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 20,
  }, maint: {
    height: 100,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowRadius: 20,
    elevation: 8,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 10,
    flexDirection: "row",
  },
  starImageStyle2: {
    width: 20,
    height: 20,
  },
  imaget: {
    height: 65,
    width: 65,
    marginLeft: 5,
    resizeMode: 'contain',
  },
  textt: {
    marginLeft: 10,
    color: '#323232',
  },
  SectionStylet: {
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
});

export default Catalogue36;
