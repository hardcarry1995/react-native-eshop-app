import React from 'react';
import { imagePrefix } from '../../constants/utils';
import { Image, StyleSheet, Text, TouchableOpacity, View, FlatList, SafeAreaView, ToastAndroid, ActivityIndicator } from 'react-native';
import { GET_SHOPPING_CART, UPDATE_SHOPPING_CART_NEW, REMOVE_FROM_CART } from '../../constants/queries';
import AsyncStorage from '@react-native-community/async-storage';
import client from '../../constants/client';
import Swipeout from 'react-native-swipeout';
import moment from 'moment';


export default class Workout extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      user: 'Buy',
      cartLoading: false,
      firstcartLoading: false,
      data: [],
      setTotalValue: 0,
      loading: false,
      count: "1",
      setAllcartcount: 0,
      userTokenData: '',
      userInfo: [],
      AllDAtaAdd: [],
      checkoutLoading: false,
    };
  }


  componentDidMount() {
    this.setState({ firstcartLoading: true });
    this.fetchToken();
    this.interval = setInterval(() =>
      this.fetchToken()
      , 5000
    );
    return () => {
      clearInterval(this.interval);
    }
  }

  async fetchToken() {
    let token = await AsyncStorage.getItem('userToken');
    let userInfo = await AsyncStorage.getItem('userInfo');
    this.setState({
      userInfo: JSON.parse(userInfo),
      userTokenData: token
    });
    this.getShoppingCart(token);
  }

  addQuantity = (item, index) => {
    let updatedQty = item?.quantity + 1;
    this.callUpdateCart(item, updatedQty);
  }

  removeQuantity = (item, index) => {
    let currentQty = item?.quantity;
    if (currentQty > 1) {
      let updatedQty = item?.quantity - 1;
      this.callUpdateCart(item, updatedQty);
    }
  }

  callUpdateCart = async (item, updatedQty) => {
    let IsLogin = await AsyncStorage.getItem('IsLogin');
    let userToken = await AsyncStorage.getItem('userToken');
    let userInfo = await AsyncStorage.getItem('userInfo');
    let variable = {};
    if (IsLogin !== 'true') {
      variable = {
        pid: item.productID,
        userid: null,
        quantity: updatedQty,
        dateCreated: moment().toISOString()
      }
    } else {
      let userID = Number(JSON.parse(userInfo)?.id);
      variable = {
        pid: item.productID,
        userid: userID,
        quantity: updatedQty,
        dateCreated: moment().toISOString()
      }
    }
    this.setState({ cartLoading: true });
    client
      .mutate({
        mutation: UPDATE_SHOPPING_CART_NEW,
        fetchPolicy: 'no-cache',
        variables: variable,
        context: {
          headers: {
            Authorization: `Bearer ${userToken}`,
            'Content-Length': 0,
          },
        },
      }).then(result => {
        if (result?.data?.postPrdShoppingCartOptimized?.success) {
          ToastAndroid.show('Product added to cart', ToastAndroid.SHORT);
          this.fetchToken();
        }
      })
      .catch(err => {
        this.setState({ cartLoading: false });
        console.log(err);
      });
  }

  getShoppingCart = (Token) => {
    this.setState({ cartLoading: true });
    client
      .mutate({
        mutation: GET_SHOPPING_CART,
        context: {
          headers: {
            Authorization: `Bearer ${Token}`,
            'Content-Length': 0,
          },
        },
      })
      .then(result => {
        this.setState({ cartLoading: false });
        this.setState({
          firstcartLoading: false
        });
        if (result?.data?.getPrdShoppingCart?.success && result?.data?.getPrdShoppingCart?.count > 0) {
          this.setState({ data: result.data.getPrdShoppingCart.result.prdShoppingCartDto })
          this.setState({ setAllcartcount: result.data.getPrdShoppingCart.count })
          this.setState({ AllDAtaAdd: result.data.getPrdShoppingCart.result })
          this.setState({ setTotalValue: result.data.getPrdShoppingCart.result.amountExlVat })
        }
      })
      .catch(err => {
        this.setState({ cartLoading: false });
        this.setState({
          firstcartLoading: false
        });
        console.log(err);
      });
  }

  EmptyListMessage = () => {
    return (
      <View>
        {this.state.setAllcartcount == 0 &&
          <Text
            style={styles.emptyListStyle}>
            Your cart is empty
          </Text>
        }
      </View>
    );
  };
  // Checkout button event.
  async checkLogin() {
    let IsLogin = await AsyncStorage.getItem('IsLogin');
    if (IsLogin === 'true') {
      this.props.navigation.navigate('Checkout', { data: this.state.data, dataAll: this.state.AllDAtaAdd })
    } else {
      this.props.navigation.navigate('AuthStack');
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
        if (result.data.deletePrdShoppingCart.success) {
          this.setState({ cartLoading: false });
        } else {
          ToastAndroid.show(
            result.data.deletePrdShoppingCart.message,
            ToastAndroid.SHORT,
          );
        }
      })
      .catch(err => {
        this.setState({ cartLoading: false });
        console.log(err);
      });
  }

  renderItem = ({ item, index }) => {
    const swipeoutBtns = [
      {
        text: 'Delete',
        type: 'delete',
        backgroundColor: '#ff362b',
        onPress: () => this.deleteProduct(item.recordID),
      },
    ];
    return (
      <Swipeout autoClose right={swipeoutBtns}>
        <View style={styles.container}>
          <View style={styles.mainCardView}>
            <View style={{ width: "80%", marginTop: 1 }}>
              <View style={{ flexDirection: 'row', }}>
                <Image
                  style={styles.proimg}
                  source={item.productImage ? { uri: `${imagePrefix}${item.productImage}` } : require('../../assets/NoImage.jpeg')}
                />
                <View style={{ marginLeft: 10, width: '55%' }}>
                  <Text style={{ fontSize: 12, color: 'gray', fontWeight: 'bold', textTransform: 'capitalize', width: "80%" }} numberOfLines={1}>
                    {item.productName}
                  </Text>
                  <View style={{ marginTop: 4, borderWidth: 0 }}>
                    <Text numberOfLines={1} style={{ color: 'gray', fontSize: 12, }}>
                      {item.description}
                    </Text>
                  </View>
                  <View style={{ marginTop: 4, borderWidth: 0, }}>
                    <Text style={{ color: 'red', fontSize: 15, }}>
                      R{(item.unitCost * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                  <View style={{ marginTop: 4, borderWidth: 0, }}>
                    <Text style={{ color: 'gray', fontSize: 12, }}>
                      R{item.unitCost.toFixed(2)}
                    </Text>
                  </View>
                </View>
                <View style={{ shadowColor: 'gray', shadowOffset: { width: 0, height: 0 }, }}>
                </View>
              </View>
            </View>
            <View style={{ shadowOpacity: 1, width: "20%", alignSelf: "center", }}>
              <View style={{ flexDirection: 'row', alignSelf: "center", justifyContent: "space-between"}}>
                <TouchableOpacity onPress={() =>
                  this.removeQuantity(item, index)
                }>
                  <Text style={{ color: 'black', fontSize: 22 }}>
                    -
                  </Text>
                </TouchableOpacity>
                <Text style={{ color: 'black', fontSize: 18, marginHorizontal: 10, height: 28, paddingHorizontal: 2, }}>
                  {item.quantity}
                </Text>
                <TouchableOpacity onPress={() => this.addQuantity(item, index) }>
                  <Text style={{ color: 'black', fontSize: 20 }}>
                    +
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Swipeout>
    );
  }

  renderCartView() {
    return (<View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginRight: 25, marginTop: -40}}>
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
          keyExtractor={(item, i) => i.toString()}
          data={this.state.data}
          renderItem={this.renderItem}
        />
      </View>
      <View />
      {this.state.setAllcartcount !== 0 &&
        <View
          style={{ flex: 1, justifyContent: 'flex-end', position: 'relative', marginTop: 90 }}>
          <View style={{ flexDirection: 'row', paddingBottom: 5, alignSelf: 'center' }}>
            <Text style={{ marginLeft: 12, color: '#323232', fontSize: 20 }}>
              Total:
            </Text>
            <Text style={{ marginLeft: 12, color: 'red', fontSize: 20 }}>
              R{this.state.setTotalValue.toFixed(2)}
            </Text>
          </View>

          <TouchableOpacity
            disabled={this.state.checkoutLoading}
            style={[styles.button, { backgroundColor: this.state.checkoutLoading ? '#ccc' : '#ff5a60' }]}
            onPress={() => this.checkLogin() }>
            <Text style={styles.buttonText}>Check Out</Text>
          </TouchableOpacity>
        </View>
      }
    </View>);
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ marginTop: -5, fontWeight: 'bold', fontSize: 20, padding: 20, }}>
          My Cart
        </Text>
        {this.state.firstcartLoading ?
          <ActivityIndicator size="large" color="#000" /> : this.renderCartView()}
      </SafeAreaView>
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
