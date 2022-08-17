import React from 'react';
import { imagePrefix } from '../constants/utils';
import { Image, ScrollView, StyleSheet, Text, View, FlatList, SafeAreaView, ToastAndroid, ActivityIndicator } from 'react-native';
import { GET_ALL_FAV_PRODUCT, UPDATE_SHOPPING_CART, REMOVE_FROM_CART } from '../constants/queries';
import AsyncStorage from '@react-native-community/async-storage';
import client from '../constants/client';
import ImageWithPlaceholder from '../components/ImageWithPlaceholder';

class WishListScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      user: 'Buy',
      cartLoading: false,
      data: [],
      setTotalValue: 0,
      loading: false,
      count: "1",
      setAllcartcount: 0,
      userTokenData: '',
      userInfo: [],
      AllDAtaAdd: [],
    };
  }


  componentDidMount() {
    this.fetchToken();
    this.interval = setInterval(() =>
      this.fetchTokenNext()
      , 5000
    );
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  async fetchToken() {
    let token = await AsyncStorage.getItem('userToken');
    let userInfo = await AsyncStorage.getItem('userInfo');
    this.setState({
      userInfo: JSON.parse(userInfo),
    });
    this.setState({
      userTokenData: token
    });
    this.getShoppingCart(token);
  }

  async fetchTokenNext() {
    let token = await AsyncStorage.getItem('userToken');
    let userInfo = await AsyncStorage.getItem('userInfo');
    this.setState({
      userInfo: JSON.parse(userInfo),
    });
    this.setState({
      userTokenData: token
    });
    this.getShoppingCartNext(token);
  }

  updateUser = user => {
    this.setState(
      prevState => ({
        user: user,
      }),
      () => {
        if (this.state.user == 'Buy') {
          this.props.navigation.navigate('Matches')
        } if (this.state.user == 'Bid') {
          this.props.navigation.navigate('SettingsScreen')
        } if (this.state.user == 'Hire') {
          this.props.navigation.navigate('PrivacyPolicy')
        }
      },
    );

  };

  addQuantity = (qnty) => {
    this.setState({ cartLoading: true });
    client
      .mutate({
        mutation: UPDATE_SHOPPING_CART,
        context: {
          headers: {
            Authorization: `Bearer ${this.state.userTokenData}`,
          },
          variables: {
            pid: qnty.productID,
            userId: Number(this.state.userInfo.id),
            quantity: 5,
            recordId: qnty.recordID,
            curdate: new Date()
          },
        },
      })
      .then(result => {
        this.setState({ cartLoading: false });
      })
      .catch(err => {
        this.setState({ cartLoading: false });
        console.log(err);
      });
  }
  removeQuantity = (qnty) => {
    qnty.quantity--;
  }
  getShoppingCart = (Token) => {
    this.setState({ cartLoading: true });
    client
      .mutate({
        mutation: GET_ALL_FAV_PRODUCT,
        context: {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        },
      })
      .then(result => {
        this.setState({ cartLoading: false });
        if (result.data.getMstFavouritesProductList.success.count > 0) {
          this.setState({ data: result.data.getMstFavouritesProductList.result })
          this.setState({ setAllcartcount: result.data.getMstFavouritesProductList.count })
          this.setState({ AllDAtaAdd: result.data.getMstFavouritesProductList.result })
          this.setState({ setTotalValue: result.data.getMstFavouritesProductList.result.amountExlVat })
        }
      })
      .catch(err => {
        this.setState({ cartLoading: false });
        console.log(err);
      });
  }

  getShoppingCartNext = (Token) => {
    this.setState({ cartLoading: false });
    client
      .mutate({
        mutation: GET_ALL_FAV_PRODUCT,
        context: {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        },
      })
      .then(result => {
        this.setState({ cartLoading: false });
        this.setState({ data: result.data.getMstFavouritesProductList.result })
        this.setState({ setAllcartcount: result.data.getMstFavouritesProductList.count })
        this.setState({ AllDAtaAdd: result.data.getMstFavouritesProductList.result })
        this.setState({ setTotalValue: result.data.getMstFavouritesProductList.result.amountExlVat })
      })
      .catch(err => {
        this.setState({ cartLoading: false });
        console.log(err);
      });
  }

  EmptyListMessage = () => {
    return (
      <View>
        {this.state.setAllcartcount == 0 &&
          <Text
            style={styles.emptyListStyle}>
            No record found
          </Text>
        }
      </View>
    );
  };
  async checkLogin() {
    let IsLogin = await AsyncStorage.getItem('IsLogin');
    if (IsLogin === 'true') {
      this.props.navigation.navigate('AddWorkout', { data: this.state.data, dataAll: this.state.AllDAtaAdd })
    } else {
      this.props.navigation.navigate('Login')
    }
  }
  deleteProduct(item) {
    this.setState({ cartLoading: true });
    client
      .mutate({
        mutation: REMOVE_FROM_CART,
        context: {
          headers: {
            Authorization: `Bearer ${this.state.userTokenData}`,
            'Content-Length': 0,
          },
        },
        variables: {
          recordId: item,
        },
      })
      .then(result => {
        console.log('result', result)
        if (result.data.deletePrdShoppingCartNew.success) {
          this.setState({ cartLoading: false });
        } else {
          ToastAndroid.show(
            result.data.deletePrdShoppingCartNew.message,
            ToastAndroid.SHORT,
          );
        }
      })
      .catch(err => {
        this.setState({ cartLoading: false });
        console.log(err);
      });
  }

  renderItem = (itemDATA) => {
    const item = itemDATA.item
    return (
      <View style={styles.container}>
        <View style={styles.mainCardView}>
          <View style={{ width: "90%", marginTop: 1 }}>
            <View style={{ flexDirection: 'row', }}>
              <ImageWithPlaceholder
                style={styles.proimg}
                source={item.productImage
                  ?
                  { uri: `${imagePrefix}${item.productImage}` }
                  :
                  require('../assets/NoImage.jpeg')}
              />

              <View style={{ marginLeft: 10, width: '85%' }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: 'gray',
                    fontWeight: 'bold',
                    textTransform: 'capitalize',
                    width: "90%",
                  }}
                  numberOfLines={1}>
                  {item.productName}
                </Text>
                <View
                  style={{
                    marginTop: 4,
                    borderWidth: 0,
                  }}>
                  <Text numberOfLines={1}
                    style={{
                      color: 'gray',
                      fontSize: 12,
                    }}>
                    {item.description}
                  </Text>
                </View>
                <View
                  style={{
                    marginTop: 4,
                    borderWidth: 0,
                  }}>
                  <Text
                    style={{
                      color: 'red',
                      fontSize: 15,
                    }}>
                    R {item.unitCost}
                  </Text>
                </View>
                <View
                  style={{
                    marginTop: 4,
                    borderWidth: 0,
                  }}>
                  <Text
                    style={{
                      color: 'gray',
                      fontSize: 12,
                    }}>
                    R {item.unitCost}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  shadowColor: 'gray',
                  shadowOffset: { width: 0, height: 0 },
                }}>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <Text
            style={{
              marginTop: -5,
              fontWeight: 'bold',
              fontSize: 20,
              padding: 20,
            }}>
            My Favourites
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'flex-end',
              marginRight: 25,
              marginTop: -40,
            }}>
            <Text style={{ color: 'gray' }}>Total Items(s): </Text>
            <Text style={{ color: 'black' }}>{this.state.setAllcartcount}</Text>
          </View>

          <View style={{ paddingBottom: 10, marginTop: 10 }}>
            <FlatList
              ListEmptyComponent={this.EmptyListMessage('data')}
              ListFooterComponent={() => {
                return (
                  this.state.cartLoading && this.state.setAllcartcount !== 0 && (
                    <ActivityIndicator size="large" color="#000" />
                  )
                );
              }}
              keyExtractor={(item, i) => i}
              data={this.state.data}
              renderItem={this.renderItem}
            />
          </View>
          <View />
          {this.state.setAllcartcount !== 0 &&
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                position: 'relative',
                marginTop: 90,
              }}>
            </View>
          }
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bottomView: {
    position: 'absolute',
    left: '8%',
    right: 0,
    bottom: 10,
    justifyContent: 'center',
  },
  overicon: {
    backgroundColor: 'white',
    height: 70,
    width: 70,
    borderRadius: 50,
    position: 'absolute',
    bottom: 10,
    left: -14,
    shadowColor: '#9F1D20',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },

  button: {
    backgroundColor: '#db3236',
    padding: 10,
    borderRadius: 10,
    width: 170,
    marginTop: 10,
    alignSelf: 'center',
    marginBottom: 50
  },
  newbutton: {
    backgroundColor: '#db3236',
    padding: 8,
    borderRadius: 20,
    width: 180,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    alignSelf: 'center',
    fontSize: 22,
  },
  proimg: {
    height: 70,
    width: 70
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  mainCardView: {
    height: 100,
    width: '95%',
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 8,
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 14,
    marginTop: 6,
    marginBottom: 6,
    alignSelf: "center",
  },
  emptyListStyle: {
    marginBottom: 15,
    textAlign: 'center',
  },
});


export default WishListScreen;
