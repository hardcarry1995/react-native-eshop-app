import React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, Dimensions, View, ToastAndroid, FlatList, ActivityIndicator, TextInput } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import client from '../constants/client';
import ProductCard from '../components/ProductCard';
import Constants from "../constants/constant";
import { CREATE_FAVOURITES_PRODUCT, GET_SALE_TYPE, GET_PRODUCT_PURCHASE, ADD_TO_CART_NULL, ADD_TO_CART } from '../constants/queries';
import moment from 'moment';
import RNPickerSelect from 'react-native-picker-select';
import ProductSearchInput from '../components/ProductSearchInput';

const filterItems = [
  { label: 'Purchase', value: 'Buy' },
  { label: 'Bid', value: 'Bid' },
  { label: 'Hire', value: 'Hire' },
]

export default class ProductScreen extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      user: 'Buy',
      data: [],
      loading: false,
      userInfo: {},
      saleType: [],
      cartLoading: false,
      rating: "2",
      maxRating: [1, 2, 3, 4, 5],
      isListEnd: false,
    };
  }

  componentDidMount() {
    this.fetchToken();
  }
  async addToFavourites(item) {
    let IsLogin = await AsyncStorage.getItem('IsLogin');
    let token = await AsyncStorage.getItem('userToken');
    if (IsLogin !== 'true') {
      this.props.navigation.navigate('Auth');
    } else {
      client
        .mutate({
          mutation: CREATE_FAVOURITES_PRODUCT,
          fetchPolicy: 'no-cache',
          variables: {
            pid: item,
            userid: Number(this.state.userInfo.id)
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
  async addToCart(id) {
    let IsLogin = await AsyncStorage.getItem('IsLogin');
    let token = await AsyncStorage.getItem('userToken');
    if (IsLogin !== 'true') {
      var userIdData = null;
      this.setState({ cartLoading: true });
      client
        .mutate({
          mutation: ADD_TO_CART_NULL,
          variables: {
            pid: id,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        })
        .then(result => {
          this.setState({ cartLoading: false });
          if (result.data.postPrdShoppingCartOptimized.success) {
            ToastAndroid.show('Product added to cart', ToastAndroid.SHORT);
            this.props.navigation.navigate('CartStack')
          }
        })
        .catch(err => {
          this.setState({ cartLoading: false });
          console.log(err);
        });
    } else {
      var userIdData = this.state.userInfo.id
      this.setState({ cartLoading: true });
      client
        .mutate({
          mutation: ADD_TO_CART,
          variables: {
            pid: id,
            userid: Number(this.state.userInfo.id),
            dateCreated: moment().toISOString()
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        })
        .then(result => {
          this.setState({ cartLoading: false });
          if (result.data.postPrdShoppingCartOptimized.success) {
            ToastAndroid.show('Product added to cart', ToastAndroid.SHORT);
            this.props.navigation.navigate('CartStack')
          }
        })
        .catch(err => {
          this.setState({ cartLoading: false });
          console.log(err);
        });
    }

    // }
  }
  async fetchToken() {
    let token = await AsyncStorage.getItem('userToken');
    let userInfo = await AsyncStorage.getItem('userInfo');
    this.setState({
      userInfo: JSON.parse(userInfo),
    });
    this.fetchProducts(token);
    this.getPrdSalesType(token);
  }
  async getPrdSalesType(token) {
    client
      .query({
        query: GET_SALE_TYPE,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Length': 0,
          },
        },
      })
      .then(async result => {
        if (result.data.getPrdSalesType.success) {
          this.setState({ saleType: result.data.getPrdSalesType.result });
        } else {
          ToastAndroid.show(
            result.data.getPrdSalesType.message,
            ToastAndroid.SHORT,
          );
        }
      })
      .catch(err => {
        this.setState({ loading: false });
        console.log(err);
      });
  }

  fetchProducts(token) {
    this.setState({ loading: true });
    client
      .query({
        query: GET_PRODUCT_PURCHASE,
        variables: {
          size: 20,
        },
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      })
      .then(result => {
        this.setState({ loading: false });
        if (result.data.getPrdProductList.success) {
          this.setState({ data: result.data.getPrdProductList.result });
        } else {
          ToastAndroid.show(
            result.data.getPrdProductList.message,
            ToastAndroid.SHORT,
          );
        }
      })

      .catch(err => {
        this.setState({ loading: false });
        console.log(err);
      });
  }

  updateUser = user => {
    this.setState(
      prevState => ({
        user: user,
      }),
      () => {
        if (this.state.user == 'Buy') {
          this.props.navigation.navigate('ProductStack')
        } if (this.state.user == 'Bid') {
          this.props.navigation.navigate(Constants.settings)
        } if (this.state.user == 'Hire') {
          this.props.navigation.navigate(Constants.privacy_policy)
        }
      },
    );

  };
  renderItem = ({ item, index }) => (
    <ProductCard
      navigation={this.props.navigation}
      item={item}
      key={index}
      addToFavourites={(value) => this.addToFavourites(value)}
      addToCart={(value) => this.addToCart(value)}
    />
  );

  _onPressFilterIcon = () => {
    this.props.navigation.navigate('CategoryStack');
  }

  render() {
    return (
      <View style={styles.container}>
        <ProductSearchInput onChangeText={(value) => this.handleSearch(value)} onPressFilterIcon={() => this.props.navigation.navigate('CategoryStack')} />

        <RNPickerSelect
          value={this.state.user}
          onValueChange={this.updateUser}
          items={filterItems}
          textInputProps={styles.pickerContainer}
        />
        <View style={styles.productListContainer}>
          <FlatList
            numColumns={2}
            style={styles.flatList}
            showsVerticalScrollIndicator={false}
            data={this.state.data}
            renderItem={this.renderItem}
            ListFooterComponent={() => {
              return (
                this.state.loading ? (
                  <ActivityIndicator size="large" color="#000" />
                ) : null
              )
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: '#fff',
  },
  searchContainer: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: 'lightgray',
    height: '55%',
    borderRadius: 10,
    margin: 15,
  },
  searchIconStyle: {
    padding: 10,
    margin: 5,
    height: 20,
    width: 20,
    resizeMode: 'stretch',
    alignItems: 'center',
  },
  filterIcon: {
    padding: 10,
    margin: 15,
    height: 20,
    width: 20,
    resizeMode: 'stretch',
    alignItems: 'center',
  },
  pickerContainer: {
    borderRadius: 5,
    borderColor: '#DCDCDC',
    borderWidth: 2,
    height: 50,
    width: 140,
    left: 15,
    bottom: 10,
    textAlign: 'center',
    color: 'red',
    fontSize: 18
  },
  productListContainer: {
    justifyContent: 'center',
    paddingTop: 20,
    alignItems: 'center',
    flex: 1,
  },
  flatList: {
    flex: 1,
    width: '100%',
    marginBottom: -17
  }


});
