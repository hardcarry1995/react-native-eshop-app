import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, ToastAndroid, Linking, Platform } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-community/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import { connect } from 'react-redux';
import { bearerToken } from '../constants/utils';
import client from '../constants/client';
import Constants from "../constants/constant";
import { SPECIAL_PRODUCT, CREATE_FAVOURITES_PRODUCT, ADD_TO_CART, GET_PRODUCT, GUEST_LOGIN, ADD_TO_CART_NULL } from '../constants/queries';
import SpecialCard from '../components/SpecialProduct';
import SQLite from 'react-native-sqlite-storage';
import moment from 'moment';
import DeepLinking from 'react-native-deep-linking';
import setGet from '../utils/setGet';
import ProductCard from '../components/ProductCard';
import ProductSearchInput from '../components/ProductSearchInput';
import CategorySelector from "../components/CategorySelector";
import { Chip } from "react-native-elements";

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    SQLite.DEBUG = true;
    this.state = {
      size: 10,
      specialSize: 10,
      data: [],
      isproductID: '',
      special_data: [],
      loading: false,
      userInfo: {},
      cartLoading: false,
      textnew: "",
      dataEMP: [],
      SQLiteProduct: [],
      specialData: [],
      rating: "2",
      maxRating: [1, 2, 3, 4, 5],
      isListEnd: false,
      loginToken: '',
      isCartLoading: false,
      paymentData: {
        merchant_id: 10001460,
        merchant_key: '0j4uaurpqk87v',
        amount: 60.00,
        item_name: 'React Native Purchase'
      },
      user: '',
      startDate: 1519026163000, timeEnd: 1519126755000,
      starImageFilled:
        'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_filled.png',
      starImageCorner:
        'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_corner.png',
      showCategorySelector: false,
      categoriesForSearch : []

    };
    this.linkingUrlSub = null;
  }

  ExecuteQuery = (sql, params = []) => new Promise((resolve, reject) => {
    var db = SQLite.openDatabase({ name: "testdatabase.db", createFromLocation: "~testdatabase.db" });
    db.transaction((trans) => {
      trans.executeSql(sql, params, (trans, results) => {
        resolve(results);
      },
        (error) => {
        });
    });
  });

  componentDidMount() {
    const scheme1 = 'https://ezyfind.me/';
    DeepLinking.addScheme('https://sandbox.payfast.co.za/');
    DeepLinking.addScheme(scheme1);

    this.linkingUrlSub = Linking.addEventListener('url', this.handleUrl);
    DeepLinking.addRoute('eng/process?merchant_id=10001460&merchant_key=0j4uaurpqk87v&return_url=https%3a%2f%2fwww.LawyersEzyFind.co.za%2fLCPayFastReturn.html&cancel_url=https%3a%2f%2fwww.LawyersEzyFind.co.za%2fLCPayFastCancel.html&notify_url=http%3a%2f%2fmobileapiv2.ezyfind.co.za%2fapi%2fUser%2fNotify%3f&m_payment_id=13216&amount=1151.70&item_name=Company+33&item_description=Purchased+EzyFindMobileApi.Model.MstPackage+Package&subscription_type=1&recurring_amount=1151.70&frequency=4&cycles=0', (response) => {
      this.setState({ response });
    });

    DeepLinking.addRoute('/Cancel', (response) => {
      this.handleNavigation(response?.path);
    });

    DeepLinking.addRoute('/Return', (response) => {
      this.handleNavigation(response?.path);
    });

    if (!setGet.get()) {
      Linking.getInitialURL().then((url) => {
        if (url) {
          const path = url?.replace(scheme1, "");
          setGet.set();
          this.handleNavigation(path);
        }
      }).catch(err => console.error('An error occurred', err));
    }
    this.checkLogin();
    this.getPayment();
  }

  componentWillUnmount() {
    if (this.linkingUrlSub) {
      this.linkingUrlSub.remove();
    }
  }

  handleUrl = ({ url }) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        DeepLinking.evaluateUrl(url);
      }
    });
  }

  handleNavigation = (path) => {
    if (!path) return;
    if (path.includes('Cancel')) {
      this.props.navigation.navigate('PaymentFail');
    } else if (path.includes('Return')) {
      this.props.navigation.navigate('PaymentSuccess');
    } else { }
  }

  getPayment() {
    let urlData = "https://sandbox.payfast.co.za/eng/process?merchant_id=10001460&merchant_key=0j4uaurpqk87v&return_url=https%3a%2f%2fwww.LawyersEzyFind.co.za%2fLCPayFastReturn.html&cancel_url=https%3a%2f%2fwww.LawyersEzyFind.co.za%2fLCPayFastCancel.html&notify_url=http%3a%2f%2fmobileapiv2.ezyfind.co.za%2fapi%2fUser%2fNotify%3f&m_payment_id=13216&amount=1151.70&item_name=Company+33&item_description=Purchased+EzyFindMobileApi.Model.MstPackage+Package&subscription_type=1&recurring_amount=1151.70&frequency=4&cycles=0";
    const url = urlData
    fetch(url, { method: 'POST' })
      .then(response => response)
      .then(responseJson => {
      })
      .catch(error => {
        console.error(error);
      });
  };

  async checkLogin() {
    let token = await AsyncStorage.getItem('userToken');
    let IsLogin = await AsyncStorage.getItem('IsLogin');
    if (IsLogin === 'true') {
      const { refered_by = '' } = this.props.state || {};
      const paredRB = refered_by ? JSON.parse(refered_by) : {};
      if (paredRB?.name) {
        this.props.navigation.navigate(paredRB?.name, { refered_data: paredRB?.data });
      }
      this.fetchToken();
      setInterval(() => {
        this.checkConnectivity();
      }, 5000);
    } else {
      if (token == '' || token == null) {
        this.getQuestToken();
      } else {
        this.fetchToken();
        setInterval(() => {
          this.checkConnectivity();
        }, 5000);
      }
    }
  }


  async checkConnectivity() {
    NetInfo.fetch().then(state => {
      if (state.isConnected == false) {
        AsyncStorage.setItem('setInternet', 'set');
        ToastAndroid.show('No internet connection', ToastAndroid.SHORT);
      }
    });
  }


  getQuestToken = async () => {
    client
      .query({
        query: GUEST_LOGIN,
        context: {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            'Content-Length': 0,
          },
        },
      })
      .then(async result => {
        await AsyncStorage.setItem('userToken', result.data.guestLogin.result.value);
        this.CreateTable();
        this.fetchToken();
        setInterval(() => {
          this.checkConnectivity();
        }, 1000);
      })
      .catch(err => {
        this.setState({ loading: false });
        console.log(err);
      });
  }
  async addCounrty(deta) {
    let countryData = deta;
    let countryQuery = "INSERT INTO ezyFindProductDetail( activeText , categoryID , categoryName,unitCost  ,description ,documentName ,documentPath,isActive ,productID ,productImage ,productName, productNumber) VALUES";
    for (let i = 0; i < countryData.length; ++i) {
      let dataid = i + 1;
      let escapedSample = countryData[i].description.replace(/\'/g, "")
      countryQuery = countryQuery + "('"
        + countryData[i].activeText //user_id
        + "','"
        + countryData[i].categoryID //country_name
        + "','"
        + countryData[i].categoryName //id
        + "','"
        + countryData[i].unitCost //id
        + "','"
        + escapedSample  //country_name
        + "','"
        + countryData[i].documentName //id
        + "','"
        + countryData[i].documentPath //user_id
        + "','"
        + countryData[i].isActive //country_name
        + "','"
        + countryData[i].productID //id
        + "','"
        + countryData[i].productImage //user_id
        + "','"
        + countryData[i].productName //country_name
        + "','"
        + countryData[i].productNumber //is_deleted
        + "')";
      if (i != countryData.length - 1) {
        countryQuery = countryQuery + ",";
      }
    }
    countryQuery = countryQuery + ";";
    let countryMultipleInsert = await this.ExecuteQuery(countryQuery, []);

  }
  // Create Table
  async CreateTable() {
    global.db = SQLite.openDatabase(
      {
        name: 'testdatabase.db',
        location: 'default',
        createFromLocation: '~testdatabase.db',
      },
      () => { },
      error => {
        console.log("ERROR: " + error);
      }
    );
    await this.ExecuteQuery("CREATE TABLE IF NOT EXISTS ezyFindProductDetail (activeText VARCHAR(16), categoryID INTEGER, categoryName VARCHAR(16),unitCost VARCHAR(16),description TEXT,documentName VARCHAR(225),documentPath VARCHAR(225),isActive VARCHAR(16),productID INTEGER,productImage VARCHAR(225),productName VARCHAR(225), productNumber VARCHAR(225))", []);

  }
  async SelectQuery() {
    let selectQuery1 = await this.ExecuteQuery("SELECT * FROM ezyFindProductDetail", []);
    var rows1 = selectQuery1.rows;
    for (let i = 0; i < rows1.length; i++) {
      var item1 = rows1.item(i)
      this.state.SQLiteProduct.push(item1);
    }
    const newArrayList = [];
    this.state.SQLiteProduct.forEach(obj => {
      if (!newArrayList.some(o => o.productNumber === obj.productNumber)) {
        newArrayList.push({ ...obj });
      }
    });

    this.setState({ data: newArrayList });
  }

  handleSearch = (text) => {
    this.setState({ textnew: text });
    let vdata = this.state.dataEMP.filter(i =>
      i.productName.toLowerCase().includes(text.toLowerCase()))
    this.setState({ data: vdata });
    // let vcdata = this.state.specialData.filter(i =>
    //   i.specialName.toLowerCase().includes(text.toLowerCase()))
    // this.setState({ special_data: vcdata });
  };

  EmptyListMessage = ({ item }) => {
    return (
      <Text
        style={styles.emptyListStyle}>
        No Data Found
      </Text>
    );
  };
  fetchMoreUsers = () => {
    if(this.state.textnew == ""){
      this.setState(
        prevState => ({
          size: prevState.size + 10,
        }),
        () => {
          this.fetchProductsNext();
        },
      );
    }
  };

  async fetchToken() {
    let token = await AsyncStorage.getItem('userToken');
    let userInfo = await AsyncStorage.getItem('userInfo');
    this.setState({
      userInfo: JSON.parse(userInfo),
    });
    this.props.setUserToken(token);
    this.setState({
      loginToken: token
    });
    this.fetchProducts(token);
    this.fetchSpecialProduct(token);

  }

  fetchProducts(token, categories = null) {
    this.setState({ loading: true });
    client
      .query({
        query: GET_PRODUCT,
        variables: {
          size: this.state.size,
          categories : categories
        },
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      })
      .then(result => {
        if (result.data.getPrdProductList.result.length > 0) {
          this.setState({ dataEMP: result.data.getPrdProductList.result });
          let data = result.data.getPrdProductList.result ;
          if(this.state.textnew !== ""){
            data = data.filter(i => i.productName.toLowerCase().includes(this.state.textnew.toLowerCase()))
          }
          this.setState({ data: data });
          this.addCounrty(result.data.getPrdProductList.result);
          this.setState({ loading: false });
        } else {
          this.setState({ dataEMP: [] });
          this.setState({ data: [] });
          this.setState({ isListEnd: true });
          this.setState({ loading: false });
        }
      })
      .catch(err => {
        this.setState({ loading: false });
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
  fetchProductsNext() {
    if (!this.loading && !this.isListEnd) {
      this.setState({ loading: true });
      const catIds = this.state.categoriesForSearch.map(cat => cat.categoryId).join(",");
      client
        .query({
          query: GET_PRODUCT,
          fetchPolicy: 'no-cache',
          variables: {
            size: this.state.size,
            categories: catIds
          },
          context: {
            headers: {
              Authorization: `Bearer ${this.state.loginToken}`,
            },
          },
        })
        .then(result => {
          if (result.data.getPrdProductList.result.length > 0) {
            this.setState({ data: result.data.getPrdProductList.result });

          } else {
            ToastAndroid.show(
              result.data.getPrdProductList.message,
              ToastAndroid.SHORT,
            );
            this.setState({ isListEnd: true });
            this.setState({ loading: false });
          }
        })
        .catch(err => {
          this.setState({ loading: false });
          console.log(err);
        });
    }
  }

  fetchSpecialProduct(token) {
    client
      .query({
        query: SPECIAL_PRODUCT,
        variables: {
          size: 10,
        },
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      })
      .then(result => {
        if (result.data.getMstSpecialList.success) {
          this.setState({ special_data: result.data.getMstSpecialList.result });
          this.setState({ specialData: result.data.getMstSpecialList.result });
        } else {
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  async addToFavourites(item) {
    let IsLogin = await AsyncStorage.getItem('IsLogin');
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
              Authorization: `Bearer ${this.props.state.userToken}`,
            },
          },
        })
        .then(result => {
          if (result.data.createMstFavourites.mstFavouriteId) {
            if(Platform.OS == "android"){
              ToastAndroid.show('Product added to Favourites', ToastAndroid.SHORT);
            } else if(Platform.OS == "ios"){
              alert('Product added to Favourites');
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
  async addToCart(id) {
    let IsLogin = await AsyncStorage.getItem('IsLogin');
    this.setState({ isCartLoading: true })
    this.setState({ isproductID: id })
    if (IsLogin !== 'true') {
      var userIdData = null;
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
              Authorization: `Bearer ${this.props.state.userToken}`,
              'Content-Length': 0,
            },
          },
        })
        .then(result => {
          this.setState({ cartLoading: false });
          if (result.data.postPrdShoppingCartOptimized.success) {
            ToastAndroid.show('Product added to cart', ToastAndroid.SHORT);
            this.setState({ isCartLoading: false })
            this.props.navigation.navigate('CartStack')
          }
        })
        .catch(err => {
          this.setState({ isCartLoading: false })
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
              Authorization: `Bearer ${this.props.state.userToken}`,
            },
          },
        })
        .then(result => {
          this.setState({ cartLoading: false });
          if (result.data.postPrdShoppingCartOptimized.success) {
            ToastAndroid.show('Product added to cart', ToastAndroid.SHORT);
            this.setState({ isCartLoading: false })
            this.props.navigation.navigate('CartStack')
          }
        })
        .catch(err => {
          this.setState({ isCartLoading: false })
          console.log(err);
        });
    }
  }
  renderItem = ({ item, index }) => (
    <ProductCard
      navigation={this.props.navigation}
      item={item}
      key={index}
      addToFavourites={(value) => this.addToFavourites(value)}
      addToCart={(value) => this.addToCart(value)}
    />
  );

  _onSelectCategoryDone = (categories) => {
    this.setState({ categoriesForSearch: categories, showCategorySelector : false});
    this._filterByCategory(categories);
  } 

  _onPressSelectedCategory = (item) => {
    const items = this.state.categoriesForSearch.filter((cat) => cat.categoryId != item.categoryId);
    this.setState({ categoriesForSearch: items});
    this._filterByCategory(items);
  }

  _filterByCategory = (categories) => {
    if(categories.length > 0){
      const catIds = categories.map(cat => cat.categoryId).join(",");
      this.fetchProducts(this.state.loginToken, catIds);
    } else {
      this.fetchProducts(this.state.loginToken);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ paddingBottom: 30, flex: 1 }}>
          <ProductSearchInput 
            onChangeText={(value) => this.handleSearch(value)} 
            onPressFilterIcon={() => this.setState({ showCategorySelector : true})} />

          {this.state.categoriesForSearch.length > 0 && <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom : 20, paddingHorizontal : 10}}>
            {this.state.categoriesForSearch.map(item => (
              <Chip 
                title={item.categoryName}
                icon={{
                  name: 'close',
                  type: 'font-awesome',
                  size: 14,
                  color: 'white',
                }}
                onPress={() => this._onPressSelectedCategory(item)}
                iconRight
                titleStyle={{ fontSize: 10 }}
                buttonStyle={{ backgroundColor: '#F54D30', marginBottom: 5}}
              />
            ))}
          </View>}
          
          <RNPickerSelect
            value={this.state.user}
            onValueChange={this.updateUser}
            items={[
              { label: 'Purchase', value: 'Buy' },
              { label: 'Bid', value: 'Bid' },
              { label: 'Hire', value: 'Hire' },
            ]}
            textInputProps={styles.pickerContainer}
          />

          <FlatList
            ListEmptyComponent={this.EmptyListMessage('data')}
            numColumns={2}
            ListFooterComponent={() => {
              return (
                this.state.loading ? (
                  <ActivityIndicator size="large" color="#000" />
                ) : null
              )
            }}
            ListHeaderComponent={() => {
              if(this.state.special_data.length === 0){
                return null;
              }
              return (
                <View style={{ padding: 5, flex: 1 }}>
                  <Text style={styles.sectionLabel}> SPECIAL PRODUCTS </Text>
                  <SpecialCard allData={this.state.special_data} navigation={this.props.navigation} />
                  <Text style={styles.sectionLabel}> ALL PRODUCTS </Text>
                </View>
              );
            }}
            data={this.state.data}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={this.fetchMoreUsers}
            onEndReachedThreshold={0.5}
          />
        </View>
        <CategorySelector 
          visible={this.state.showCategorySelector} 
          onDone={(values) => this._onSelectCategoryDone(values)}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  state: state,
});

const mapDispatchToProps = dispatch => ({
  setUserToken: value => {
    dispatch({
      type: 'SET_TOKEN',
      payload: value,
    });
  },
});


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  input: {
    paddingLeft: 0,
    backgroundColor: '#fff',
    color: '#424242',
    marginLeft: 50,
    marginTop: -30,
    width: '60%',
    height: 40,
  },
  textinput: {
    borderRadius: 10,
    fontSize: 12,
    borderColor: '#959595',
    borderWidth: 1,
    margin: 20,
    padding: 5,
    height: 50,
  },
  emptyListStyle: {
    marginBottom: 15,
    textAlign: 'center',
  },


  starImageStyle: {
    width: 12,
    height: 12,
    marginRight: 2
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
  sectionLabel: {
    fontSize: 20,
    color: '#DB3236',
    marginLeft: 27
  }

});


export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);




