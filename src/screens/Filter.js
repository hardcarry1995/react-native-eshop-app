import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, ToastAndroid } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Colors from '../constants/colors';
import { textHeader } from '../components/styles';
import HeaderBackLeft from '../components/HeaderBackLeft';
import { imagePrefix } from '../constants/utils';
import { ADD_TO_CART, ADD_TO_CART_NULL, CREATE_FAVOURITES_PRODUCT } from '../constants/queries';
import client from '../constants/client';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';

export default class Filter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      cartLoading: false,
      genderIndex: -1,
      exerciseTypeIndex: -1,
      sliderOneValue: [4],
      multiSliderValue: [10, 30],
    };
  }


  async addToFavourites(item) {
    let IsLogin = await AsyncStorage.getItem('IsLogin');
    if (IsLogin !== 'true') {
      this.props.navigation.navigate('Auth');
    } else {
      let userInfo = await AsyncStorage.getItem('userInfo');
      let token = await AsyncStorage.getItem('userToken');
      client
        .mutate({
          mutation: CREATE_FAVOURITES_PRODUCT,
          fetchPolicy: 'no-cache',
          variables: {
            pid: item,
            userid: Number(userInfo.id)
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        })
        .then(result => {
          console.log('result>>>>>', result)
          if (result.data.createMstFavourites.mstFavouriteId) {
            ToastAndroid.show('Product added to Favourites', ToastAndroid.SHORT);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
  addToCart = async (id) => {
    let IsLogin = await AsyncStorage.getItem('IsLogin');
    let userToken = await AsyncStorage.getItem('userToken');
    let userInfo = await AsyncStorage.getItem('userInfo');
    if (IsLogin !== 'true') {
      var userIdData = null;
      this.setState({ cartLoading: true });
      console.log(">>>>>>>>>>>>>>>>>>>>>>id", id);
      console.log(">>>>>>>>>>>>>>>>>>>>>>i", userInfo);
      client
        .mutate({
          mutation: ADD_TO_CART_NULL,
          fetchPolicy: 'no-cache',
          variables: {
            pid: id,
          },
          context: {
            headers: {
              Authorization: `Bearer ${userToken}`,
              'Content-Length': 0,
            },
          },
        })
        .then(result => {
          this.setState({ cartLoading: false });
          if (result.data.postPrdShoppingCartOptimized.success) {
            ToastAndroid.show('Product added to cart', ToastAndroid.SHORT);
            this.props.navigation.navigate('Workout')
          }
        })
        .catch(err => {
          this.setState({ cartLoading: false });
          console.log(err);
        });
    } else {
      let userToken1 = await AsyncStorage.getItem('userToken');
      let userInfo = await AsyncStorage.getItem('userInfo');
      let userID = JSON.parse(userInfo)
      client
        .mutate({
          mutation: ADD_TO_CART,
          fetchPolicy: 'no-cache',
          variables: {
            pid: id,
            userid: Number(userID.id),
            dateCreated: moment().toISOString()
          },
          context: {
            headers: {
              Authorization: `Bearer ${userToken1}`,
              'Content-Length': 0,
            },
          },
        })
        .then(result => {
          console.log('result', result);
          if (result.data.postPrdShoppingCartOptimized.success) {
            ToastAndroid.show('Product added to cart', ToastAndroid.SHORT);
            this.props.navigation.navigate('Workout')
          }
        })
        .catch(err => {
          this.setState({ cartLoading: false });
          console.log(err);
        });
    }
  }

  render() {
    const { navigation } = this.props;
    const data = this.props.route.params.data;
    const imagePath = `${imagePrefix}${data.imagePath || data.productImage}`;
    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <View style={{ padding: 10, flex: 1 }}>
            <View style={{ alignSelf: 'center', marginLeft: 1 }}>
              <Image
                style={{ height: 150, width: 150, padding: 5 }}
                source={{ uri: imagePath }}
              />
            </View>

            <Text
              style={{ fontSize: 22, fontWeight: 'bold', marginTop: 10 }}
              numberOfLines={1}>
              {data.productName || data.specialName}
            </Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#316EE6' }}>
              {data.categoryName}
            </Text>
            <View style={{ flexDirection: 'row', paddingTop: 5 }}>
              <Image
                style={{ width: 15, height: 15, marginLeft: 2, marginRight: 2 }}
                source={require('../assets/stargold.png')}
              />
              <Image
                style={{ width: 15, height: 15, marginLeft: 2, marginRight: 2 }}
                source={require('../assets/stargold.png')}
              />
              <Image
                style={{ width: 15, height: 15, marginLeft: 2, marginRight: 2 }}
                source={require('../assets/stargold.png')}
              />
              <Image
                style={{ width: 15, height: 15, marginLeft: 2, marginRight: 2 }}
                source={require('../assets/stargold.png')}
              />
              <Image
                style={{ width: 17, height: 17, marginLeft: 2, marginRight: 2 }}
                source={require('../assets/starwhite.png')}
              />
              <Text style={{ fontSize: 10, color: '#316EE6', marginLeft: 10 }}>
                204 Reviews
              </Text>
            </View>
            <View
              style={{ flexDirection: 'row', paddingTop: 0, paddingBottom: 20 }}>
              <Text style={{ fontSize: 25, fontWeight: '500' }}>R {data.unitCost}</Text>
              <Text
                style={{
                  fontSize: 9,
                  color: 'gray',
                  marginLeft: 10,
                  marginTop: 16,
                  fontWeight: '500',
                }}>
                R {data.unitCost}
              </Text>
            </View>
            <Text>Free Delivery</Text>
            <View
              style={{
                height: 1,
                width: '100%',
                backgroundColor: '#AAA',
                marginVertical: 5,
              }}
            />
            <Text style={{ fontSize: 18 }}>Describtion</Text>
            <Text style={{ color: '#CCC' }}>
              {data.description || data.specialDescription}
            </Text>

            <View
              style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <TouchableOpacity
                onPress={() => {
                  this.addToFavourites(data.productID)
                }}
                style={{
                  marginTop: 16,
                  paddingTop: 10,
                  paddingBottom: 10,
                  backgroundColor: '#fff',
                  borderRadius: 5,
                  borderColor: 'red',
                  borderWidth: 1,
                  width: '30%',
                  height: 50,
                }}
                underlayColor="gray"
                activeOpacity={0.8}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    style={{
                      height: 25,
                      width: 25,
                      marginRight: 2,
                      tintColor: 'red',
                      resizeMode: 'contain',
                    }}
                    source={require('../assets/img/Path182.png')}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  this.addToCart(data.productID)
                }}
                style={{
                  marginTop: 16,
                  paddingTop: 10,
                  paddingBottom: 10,
                  backgroundColor: 'red',
                  borderRadius: 5,
                  width: '50%',
                  height: 50,
                }}
                activeOpacity={0.8}
              >

                {this.state.cartLoading ? (

                  <ActivityIndicator color="white" style={{ alignItems: 'center' }} />
                ) : (
                  <View style={{ flexDirection: 'row' }}>
                    <Image
                      style={{
                        height: 25,
                        width: 25,
                        tintColor: '#fff',
                        marginLeft: 12,
                      }}
                      source={require('../assets/shopping.png')}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#fff',
                        fontWeight: 'bold',
                        marginLeft: 12,
                        marginTop: 2,
                      }}>
                      Add To Cart
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },

  radio_button: {
    paddingTop: 10,
    paddingBottom: 10,
  },

  radio_button_label: {},

  radio_button_wrapper: {
    marginRight: 10,
  },

  exercise_type_style: {
    marginTop: 10,
  },

  text_heading: {
    marginLeft: 10,
    fontSize: 18,
    color: 'black',
  },

  separator: {
    height: 1,
    backgroundColor: Colors.separator_color,
    margin: 10,
  },

  marker_style: {
    height: 20,
    width: 20,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
