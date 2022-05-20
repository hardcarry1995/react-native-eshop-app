import React, { Component, PureComponent } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image, Dimensions, ToastAndroid, FlatList, ActivityIndicator } from 'react-native';
import { GetRating } from './GetRating';
import { imagePrefix } from '../constants/utils';
import client from '../constants/client';
import { SPECIAL_PRODUCT, CREATE_FAVOURITES_SPECIAL, ADD_TO_CART_NULL, ADD_TO_CART } from '../constants/queries';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from "react-native-toast-message";
import moment from "moment";

class SpecialProduct extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rating: "2",
      specialSize: 10,
      maxRating: [1, 2, 3, 4, 5],
      data: [],
      special_data_New: [],
      loading: false,
      userInfo: {},
      cartLoading: false,
      vdata: [],
      textnew: [],
      dataEMP: [],
      SQLiteProduct: [],
      userToken: '',
      specialDataNew: [],
      result: null,
      starImageFilled: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_filled.png',
      starImageCorner: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_corner.png',
    }
  }

  componentDidMount() {
    this.checkLogin();
    const allData = this.props
    this.setState({ special_data_New: allData.allData, specialDataNew: allData.allData })
  }

  async addToFavourites(item) {
    let IsLogin = await AsyncStorage.getItem('IsLogin');
    if (IsLogin !== 'true') {
      this.props.navigation.navigate('AuthStack');
    } else {
      client
        .mutate({
          mutation: CREATE_FAVOURITES_SPECIAL,
          fetchPolicy: 'no-cache',
          variables: {
            pid: item,
            userid: this.state.userInfo.id
          },
          context: {
            headers: {
              Authorization: `Bearer ${this.state.userToken}`,
            },
          },
        })
        .then(result => {
          if (result.data.createMstFavourites.mstFavouriteId) {
            Toast.show({
              type: "success",
              text1 : "Success",
              text2 : 'Special added to Favourites'
            })
          }
        })
        .catch(err => {
          console.log(err);
          Toast.show({
            type: "error",
            text1 : "Error",
            text2 : 'Something went wrong!'
          })
        });
    }
  }

  async addToCart(id) {
    let IsLogin = await AsyncStorage.getItem('IsLogin');
    this.setState({ cartLoading: true })
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
              Authorization: `Bearer ${this.state.userToken}`,
              'Content-Length': 0,
            },
          },
        })
        .then(result => {
          this.setState({ cartLoading: false });
          if (result.data.postPrdShoppingCartOptimized.success) {
            Toast.show({
              type: "success",
              text1 : "Success",
              text2 : 'Product added to cart'
            })
            this.setState({ cartLoading: false })
            this.props.navigation.navigate('CartStack')
          } else {
            Toast.show({
              type: "error",
              text1 : "Oop!",
              text2 : result.data.postPrdShoppingCartOptimized.message
            })
          }
        })
        .catch(err => {
          this.setState({ cartLoading: false })
          console.log(err);
        });
    } else {
      var userIdData = this.state.userInfo.id
      this.setState({ cartLoading: true });
      client
        .mutate({
          mutation: ADD_TO_CART,
          fetchPolicy: 'no-cache',
          variables: {
            pid: id,
            userid: Number(this.state.userInfo.id),
            dateCreated: moment().toISOString()
          },
          context: {
            headers: {
              Authorization: `Bearer ${this.state.userToken}`,
            },
          },
        })
        .then(result => {
          this.setState({ cartLoading: false });
          if (result.data.postPrdShoppingCartOptimized.success) {
            Toast.show({
              type: "success",
              text1 : "Success",
              text2 : 'Product added to cart'
            })
            this.setState({ cartLoading: false })
            this.props.navigation.navigate('CartStack')
          } else {
            Toast.show({
              type: "error",
              text1 : "Oop!",
              text2 : result.data.postPrdShoppingCartOptimized.message
            })
          }
        })
        .catch(err => {
          this.setState({ cartLoading: false })
          console.log(err);
        });
    }
  }

  async checkLogin() {
    let token = await AsyncStorage.getItem('userToken');
    this.setState({ userToken: token })
    let userInfo = await AsyncStorage.getItem('userInfo');
    this.setState({
      userInfo: JSON.parse(userInfo),
    });
    // this.fetchSpecialProduct(token)
  }

  fetchSpecialProduct(token) {
    if (this.state.userToken) {
      client
        .query({
          query: SPECIAL_PRODUCT,
          fetchPolicy: 'no-cache',
          variables: {
            size: this.state.specialSize,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        })
        .then(result => {
          this.setState({ special_data_New: result.data.getPrdProductList.result });
          this.setState({ specialDataNew: result.data.getPrdProductList.result });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
  getrequestItem = () => {
    this.setState({ specialSize: this.state.specialSize + 10 });
    // this.fetchSpecialProductNext();
  };

  fetchSpecialProductNext() {
    if (!this.loading && !this.isListEnd) {
      this.setState({ loading: true });
      client
        .query({
          query: SPECIAL_PRODUCT,
          fetchPolicy: 'no-cache',
          variables: {
            size: this.state.specialSize,
          },
          context: {
            headers: {
              Authorization: `Bearer ${this.state.userToken}`,
            },
          },
        })
        .then(result => {
          this.setState({ special_data_New: result.data.getPrdProductList.result });
          this.setState({ specialDataNew: result.data.getPrdProductList.result });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  renderItemSpecial = ({ item, index }) => {
    let imagege = '';
    if (item.mapProductImages.length > 0) {
      imagege = item.mapProductImages[0].imagePath;
    } else {
      imagege = '';
    }
    return (
      <TouchableOpacity activeOpacity={0.9} style={styles.itemContainer} key={index} onPress={() => this.props.navigation.navigate('Filter', { data: item })}>
        <View style={{ flex: 1, backgroundColor: '#FFF', borderRadius: 15, elevation: 5 }}>
          <View style={{ alignSelf: 'center', flex: 1 }}>
            <Image
              style={styles.productImage}
              source={imagege ? { uri: `${imagePrefix}${imagege}` } : require('../assets/NoImage.jpeg')}
            />
          </View>
          <View style={{ flex: 1, borderColor: '#eeeeee', borderRadius: 15, borderWidth: 1 }}>
            <View style={{ flexDirection: 'column', marginLeft: 10, margin: 10 }}>
              <Text numberOfLines={1} style={styles.productTitle}>
                {item.productName}
              </Text>
              <GetRating companyId={item.specialID} onprogress={(Rating) => { this.setState({ rating: Rating }); }} />
              <View style={{ flexDirection: "row", padding: 1, paddingBottom: 5, }}>
                {this.state.maxRating.map((item, key) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      key={key}>
                      <Image
                        style={styles.starImageStyle}
                        source={ item <= this.state.rating ? { uri: this.state.starImageFilled } : { uri: this.state.starImageCorner }}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.productPrice}>
                R {item.unitCost.toFixed(2)}
              </Text>
              <Text numberOfLines={2} style={{ color: '#BBB', marginTop: 5 }}>
                {item.description}
              </Text>
            </View>
            <View style={{ justifyContent: 'space-around', flexDirection: 'row', padding: 5 }}>
              <TouchableOpacity onPress={() => {
                this.addToFavourites(item.productID)
              }}>
                <Image
                  style={{ height: 25, width: 25, tintColor: '#bbb' }}
                  source={require('../assets/heart.png')}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.addToCart(item.productID)}>
                <Image style={styles.cartIcon} source={require('../assets/shopping.png')} resizeMode="contain" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <FlatList
        horizontal={true}
        data={this.state.special_data_New}
        renderItem={this.renderItemSpecial}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={this.getrequestItem}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => {
          return (
            this.state.loading ? (
              <View style={styles.horizontal}>
                <ActivityIndicator size="small" color="#000" />
              </View>
            ) : null
          )
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  starImageStyle: {
    width: 12,
    height: 12,
    marginRight: 2
  },
  horizontal: {
    marginTop: 120,
    padding: 20
  },
  itemContainer: {
    width: Dimensions.get('screen').width * 0.5,
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    marginRight : 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10
    
  },
  productImage: {
    height: 100,
    width: 100,
    padding: 5,
    marginVertical: 5,
  },
  productTitle: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 10,
    color: '#9f1d20',
    fontWeight: 'bold',
    marginTop: -17,
    alignSelf: 'flex-end',
  },
  cartIcon: {
    height: 25,
    width: 25,
    tintColor: '#DB3236'
  }
});

export default SpecialProduct;
