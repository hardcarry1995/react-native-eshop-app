import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, ToastAndroid, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { imagePrefix } from '../constants/utils';
import { ADD_TO_CART, ADD_TO_CART_NULL, CREATE_FAVOURITES_PRODUCT, GET_PRODUCT_RATING } from '../constants/queries';
import client from '../constants/client';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import { Rating } from 'react-native-elements';
import Toast from "react-native-toast-message";
import { connect } from "react-redux";

class ProductDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cartLoading: false,
      genderIndex: -1,
      exerciseTypeIndex: -1,
      sliderOneValue: [4],
      multiSliderValue: [10, 30],
      reviewScore : 0,
      reviewCount: 0,
      ratings : []
    };
  }

  async componentDidMount() {
    let token = await AsyncStorage.getItem('userToken');
    client.query({
      query: GET_PRODUCT_RATING,
      context: {
          headers: {
              Authorization: `Bearer ${token}`,
          },
          variables: {
              id: this.props.route.params.data.productID
          },
      },
    })
    .then(result => {
      if (result.data.getMstRatingScoreList.success) {
        // console.log(result.data.getMstRatingScoreList)
      } 
    })
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
          if (result.data.createMstFavourites.mstFavouriteId) {
            if(Platform.OS == 'android') {
              ToastAndroid.show('Product added to Favourites', ToastAndroid.SHORT);
            } else {
              alert('Product added to Favourites');
            }
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
    if (IsLogin !== 'true') {
      this.setState({ cartLoading: true });
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
            Toast.show({
              type: 'success',
              text1: "Success",
              text2: 'Product added to cart'
            })
            this.props.addProductToCart(result.data.postPrdShoppingCartOptimized.result.prdShoppingCartDto)
            this.props.navigation.navigate('CartStack')
          }
        })
        .catch(err => {
          this.setState({ cartLoading: false });
          console.log(err);
        });
    } else {
      let userInfo = await AsyncStorage.getItem('userInfo');
      console.log(userToken);
      let userID = JSON.parse(userInfo)
      client
        .mutate({
          mutation: ADD_TO_CART,
          fetchPolicy: 'no-cache',
          variables: {
            pid: id,
            userid: 0,
            dateCreated: moment().toISOString(),
          },
          context: {
            headers: {
              Authorization: `Bearer ${userToken}`,
              'Content-Length': 0,
            },
          },
        })
        .then(result => {
          if (result.data.postPrdShoppingCartOptimized.success) {
            Toast.show({
              type: 'success',
              text1: "Success",
              text2: 'Product added to cart'
            })
            this.props.addProductToCart(result.data.postPrdShoppingCartOptimized.result.prdShoppingCartDto)
            this.props.navigation.navigate('CartStack')
          } else {
          }
        })
        .catch(err => {
          this.setState({ cartLoading: false });
          console.log(err);
        });
    }
  }

  render() {
    const data = this.props.route.params.data;
    const imagePath = `${imagePrefix}${data.imagePath || data.productImage}`;
    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={{ paddingVertical: 10, paddingHorizontal: 20, flex: 1, marginBottom: 20 }}>
          <View style={{ alignSelf: 'center', marginLeft: 1 }}>
            <Image
              style={{ height: 250, width: 250, padding: 5 }}
              source={{ uri: imagePath }}
            />
          </View>
          <Text style={{ fontSize: 24, fontWeight: '700', marginTop: 10 }}>
            {data.productName || data.specialName}
          </Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#316EE6' }}>
            {data.categoryName}
          </Text>
          <View style={{ flexDirection: 'row', paddingTop: 5, alignItems: 'center', marginBottom: 10}}>
            <Rating imageSize={20} readonly startingValue={data.ratingScore} />
            <Text style={{ fontSize: 10, color: '#316EE6', marginLeft: 10 }}>
              {this.state.reviewCount} Reviews
            </Text>
          </View>
          
          <View style={{ flexDirection: 'row', paddingTop: 0, paddingBottom: 10 }}>
            <Text style={{ fontSize: 25, fontWeight: '500' }}>R {data.unitCost.toFixed(2)}</Text>
            {!!data.originalUnitCost && <Text style={{ fontSize: 9, color: 'gray', marginLeft: 10, marginTop: 16, fontWeight: '500', textDecorationLine: "line-through" }}>
              R {data.originalUnitCost.toFixed(2)}
            </Text>}
          </View>

          <Text>Free Delivery</Text>
          <View style={{ height: 1, width: '100%', backgroundColor: '#AAA', marginVertical: 5, }} />
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

          {/* Product Bid */}
          { this.props.route.params.data.salesTypeId == 2 && <View style={{ marginTop : 20}}>
            <Text style={{ fontSize: 20,}}>All Bids</Text>
            {data.prdBid.length > 0 ? <ScrollView style={{ height: 300, width: "100%", marginTop : 10}}>
              {data.prdBid.map((bid, index) => (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text style={{ fontSize: 16 }}>R {bid.bidAmount?.toFixed(2)}</Text>
                  <Text>{moment(bid.createdDate).format("YYYY-MM-DD H:m")}</Text>
                  <Text>{bid.userId}</Text>
                </View>
              ))}
            </ScrollView> :
            <Text style={{ marginTop : 5, textAlign: 'center' }}>There is no bid yet</Text>
            }
          </View> }
        </View>
      </ScrollView>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  addProductToCart : value => dispatch({
    type: "GET_CARTS_ITEMS",
    payload : value
  })
})

export default connect(null, mapDispatchToProps)(ProductDetail)
