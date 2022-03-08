import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, FlatList, TextInput, ActivityIndicator, ToastAndroid } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { imagePrefix } from '../../constants/utils';
import client from '../../constants/client';
import { SPECIAL_PRODUCT, ADD_TO_CART, GET_PRODUCT_BY_CATEGORY_HOME, GUEST_LOGIN, ADD_TO_CART_NULL } from '../../constants/queries';
import SpecialCard from '../../components/SpecialProduct';
import NetInfo from "@react-native-community/netinfo";
import SQLite from 'react-native-sqlite-storage';
import { GetRating } from '../../components/GetRating';
import moment from 'moment';


class HomeScreenCat extends React.PureComponent {

  constructor(props) {
    super(props);
    SQLite.DEBUG = true;
    this.state = {
      size: 10,
      specialSize: 10,
      email: '',
      password: '',
      data: [],
      special_data: [],
      loading: false,
      userInfo: {},
      cartLoading: false,
      vdata: [],
      textnew: [],
      dataEMP: [],
      SQLiteProduct: [],
      queryText: '',
      search: '',
      specialData: [],
      scan: false,
      ScanResult: false,
      result: null,
      rating: "2",
      maxRating: [1, 2, 3, 4, 5],
      isListEnd: false,
      loginToken: '',
      user: '',
      subcategoryId: this.props.navigation.getParam('categoryId'),
      categoryId: this.props.navigation.getParam('subCategoryId'),
      starImageFilled:
        'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_filled.png',
      starImageCorner:
        'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_corner.png',
    };
  }


  ExecuteQuery = (sql, params = []) => new Promise((resolve, reject) => {
    var db = SQLite.openDatabase({ name: "testdatabase.db", createFromLocation: "~testdatabase.db" });
    db.transaction((trans) => {
      trans.executeSql(sql, params, (trans, results) => {
        resolve(results);
      },
        (error) => {
          console.log('error>>>>>>>>>>>>>>', error);
        });
    });
  });

  componentDidMount() {
    this.checkLogin();
    console.log('categoryId', this.state.subcategoryId);
    console.log('subcategoryId', this.state.categoryId);
    // this.fetchProducts();
    // this.fetchSpecialProduct();
  }

  async checkLogin() {
    let token = await AsyncStorage.getItem('userToken');
    // console.log('token', token);
    let IsLogin = await AsyncStorage.getItem('IsLogin');
    if (IsLogin === 'true') {
      this.CreateTable();
      this.fetchToken();
      setInterval(() => {
        this.checkConnectivity();
      }, 5000);
    } else {
      if (token == '' || token == null) {
        this.getQuestToken();
      } else {
        this.CreateTable();
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
        // this.SelectQuery();
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
            // Authorization: `Bearer ${token}`,
            'Content-Length': 0,
          },
        },
      })
      .then(async result => {
        // console.log(result.data.guestLogin.result.value);
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
    let countryQuery = "INSERT INTO ezyProductDetailNewAdd( activeText , categoryID , categoryName  ,description ,documentName ,documentPath,isActive ,productID ,productImage ,productName, productNumber) VALUES";
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
    let product = await this.ExecuteQuery("CREATE TABLE IF NOT EXISTS ezyProductDetailNewAdd (activeText VARCHAR(16), categoryID INTEGER, categoryName VARCHAR(16),unitCost VARCHAR(16),description TEXT,documentName VARCHAR(225),documentPath VARCHAR(225),isActive VARCHAR(16),productID INTEGER,productImage VARCHAR(225),productName VARCHAR(225), productNumber VARCHAR(225))", []);

  }
  async SelectQuery() {
    let selectQuery1 = await this.ExecuteQuery("SELECT * FROM ezyProductDetailNewAdd", []);
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
    this.setState({
      textnew: text,
    });
    let vdata = this.state.dataEMP.filter(i =>
      i.productName.toLowerCase().includes(text.toLowerCase()))
    this.setState({ data: vdata });
    let vcdata = this.state.specialData.filter(i =>
      i.specialName.toLowerCase().includes(text.toLowerCase()))
    this.setState({ special_data: vcdata });
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
    this.setState(
      prevState => ({
        size: prevState.size + 10,
      }),
      () => {
        this.fetchProductsNext();
      },
    );
  };

  async fetchToken() {
    let token = await AsyncStorage.getItem('userToken');
    let userInfo = await AsyncStorage.getItem('userInfo');
    console.log('data check', userInfo)
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
  fetchProducts(token) {
    if (!this.loading && !this.isListEnd) {
      this.setState({ loading: true });
      console.log('this.state.categoryId', this.state.categoryId)
      client
        .query({
          query: GET_PRODUCT_BY_CATEGORY_HOME,
          // fetchPolicy: 'no-cache',
          variables: {
            size: this.state.size,
            catId: this.state.categoryId,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        })
        .then(result => {
          // this.setState({ loading: false });
          console.log(result.data.getPrdProductList.result);
          if (result.data.getPrdProductList.result.length > 0) {
            // this.setState({ size: this.state.size + 10 })
            // console.log(this.state.size)
            this.setState({ data: result.data.getPrdProductList.result });
            // this.setState({ data: [...this.state.data, ...result.data.getPrdProductList.result] });
            // console.log(result.data.getPrdProductList.result)
            this.setState({ dataEMP: result.data.getPrdProductList.result });
            this.addCounrty(result.data.getPrdProductList.result);
            this.setState({ loading: false });
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
          console.log('error>>>>>>', err);
        });
    }
  }

  updateUser = user => {
    this.setState(
      prevState => ({
        user: user,
      }),
      () => {
        console.log('check user', this.state.user);
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
  fetchProductsNext() {
    if (!this.loading && !this.isListEnd) {
      this.setState({ loading: true });
      client
        .query({
          query: GET_PRODUCT_BY_CATEGORY_HOME,
          fetchPolicy: 'no-cache',
          variables: {
            size: this.state.size,
            catId: this.state.categoryId,
          },
          context: {
            headers: {
              Authorization: `Bearer ${this.state.loginToken}`,
            },
          },
        })
        .then(result => {
          if (result.data.getPrdProductList.result.length > 0) {
            // this.setState({ size: this.state.size + 10 })
            console.log('gg', result)
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
        // fetchPolicy: 'no-cache',
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
        // this.fetchProducts();
        // console.log('result888888', result);
        if (result.data.getMstSpecialList.success) {
          // console.log('result888888', result);
          this.setState({ special_data: result.data.getMstSpecialList.result });
          this.setState({ specialData: result.data.getMstSpecialList.result });
        } else {
          console.log(result.data.getMstSpecialList.message);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  async addToCart(id) {
    let IsLogin = await AsyncStorage.getItem('IsLogin');
    if (IsLogin !== 'true') {
      // this.props.navigation.navigate('Auth');
      var userIdData = null;
      this.setState({ cartLoading: true });
      // console.log(">>>>>>>>>>>>>>>>>>>>>>id", userIdData);
      // console.log(">>>>>>>>>>>>>>>>>>>>>>i", this.state.userInfo.id);
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
            this.props.navigation.navigate('Workout')
          }
        })
        .catch(err => {
          this.setState({ cartLoading: false });
          console.log(err);
        });
    } else {
      // console.log(">>>>>>>>>>>>>>>>>>>>>>id", id);
      var userIdData = this.state.userInfo.id
      this.setState({ cartLoading: true });
      // console.log(">>>>>>>>>>>>>>>>>>>>>>id", userIdData);
      // console.log(">>>>>>>>>>>>>>>>>>>>>>i", this.state.userInfo.id);
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
              // 'Content-Length': 0,
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
    }

    // }
  }


  renderItem = ({ item, index }) => (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 10 }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          this.props.navigation.navigate('Filter', { data: item }); ``
        }}
        style={{ marginBottom: 10 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: '#FFF',
            borderRadius: 15,
            elevation: 5,
          }}>
          <View style={{ alignSelf: 'center', flex: 1 }}>
            <Image
              style={{ height: 100, width: 100, padding: 5, marginVertical: 5 }}
              source={{
                uri: `${imagePrefix}${item.productImage}`,
              }}
            />
          </View>
          <View
            style={{
              flex: 1,
              borderColor: '#eeeeee',
              borderRadius: 15,
              borderWidth: 1,
            }}>
            <View style={{ flexDirection: 'column', marginLeft: 10, margin: 10 }}>
              <Text numberOfLines={1} style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>
                {/* {item.productName.substr(0, 30)}... */}
                {item.productName}
              </Text>
              {/* {console.log("l>>>>>>>>>>>>>>>>>>",item.productID)} */}
              <GetRating companyId={item.productID} onprogress={(Rating) => { this.setState({ rating: Rating }); }} />
              <View style={{ flexDirection: "row", padding: 1, paddingBottom: 5, }}>
                {this.state.maxRating.map((item, key) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      key={item}
                    >
                      <Image
                        style={styles.starImageStyle}
                        source={
                          item <= item.ratingScore
                            ? { uri: this.state.starImageFilled }
                            : { uri: this.state.starImageCorner }
                        }
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text
                style={{
                  fontSize: 10,
                  color: '#9f1d20',
                  fontWeight: 'bold',
                  marginTop: -17,
                  alignSelf: 'flex-end',
                }}>
                R{item.unitCost}
              </Text>
              <Text numberOfLines={2} style={{ color: '#BBB' }}>
                {item.description}
              </Text>
            </View>
            <View
              style={{
                justifyContent: 'space-around',
                flexDirection: 'row',
                padding: 5,
              }}>
              <Image
                style={{ height: 25, width: 25, tintColor: '#bbb' }}
                source={require('../../assets/heart.png')}
              />
              <TouchableOpacity
                onPress={() => {
                  // console.log(item.productID);
                  // alert("ghjkl")
                  this.addToCart(item.productID)
                }}

              >
                <Image
                  style={{ height: 25, width: 25, tintColor: '#DB3236' }}
                  source={require('../../assets/shopping.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  render() {

    return (
      <View style={styles.container}>
        <View
          style={{
            paddingBottom: 30,
            flex: 1,
          }}>
          <View
            style={{
              height: 80,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View style={styles.SectionStyle}>
              <Image
                source={require('../../assets/search.png')}
                style={styles.ImageStyle}
              />

              <TextInput
                style={{ flex: 1 }}
                placeholder="Search Products"
                underlineColorAndroid="transparent"
                onChangeText={queryText => this.handleSearch(queryText)}
              />
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('ChatItem');
                }}
              >
                <Image
                  source={require('../../assets/Group28.png')}
                  style={{
                    padding: 10,
                    margin: 15,
                    height: 20,
                    width: 20,
                    resizeMode: 'stretch',
                    alignItems: 'center',
                  }}
                />
              </TouchableOpacity>
            </View>


          </View>
          <View
            style={{
              borderRadius: 5,
              borderColor: '#DCDCDC',
              borderWidth: 2,
              height: 50,
              width: 110,
              left: 10,
              bottom: 10
            }}>
            <Picker
              selectedValue={this.state.user}
              onValueChange={this.updateUser}
              style={{ color: 'red', height: 40, width: 110 }}>
              <Picker.Item label="Select" value="" />
              <Picker.Item label="Purchase" value="Buy" />
              <Picker.Item label="Bid" value="Bid" />
              <Picker.Item label="Hire" value="Hire" />
            </Picker>
          </View>
          <FlatList

            ListEmptyComponent={this.EmptyListMessage('data')}
            numColumns={2}
            // onEndReached={this.fetchProducts()}
            // onEndReachedThreshold={0.5}
            ListFooterComponent={() => {
              return (
                this.state.loading ? (
                  <ActivityIndicator size="large" color="#000" />
                ) : null
              )
            }}
            ListHeaderComponent={() => {
              return (
                <View style={{ padding: 5, flex: 1 }}>
                  <TouchableOpacity
                    onPress={() => {
                      // this.props.navigation.navigate('FaqScreen');
                    }}>
                    <Text
                      style={{ fontSize: 20, color: '#DB3236', marginLeft: 27 }}>
                      SPECIAL PRODUCTS
                    </Text>
                  </TouchableOpacity>
                  {/* <ScrollView horizontal>
                    {this.state.special_data.map((item, index) => {
                      return (
                        <SpecialCard item={item} index={index} key={index} />
                      );
                    })}
                  </ScrollView> */}

                  <SpecialCard />

                  <Text
                    style={{ fontSize: 20, color: '#DB3236', marginLeft: 27 }}>
                    ALL PRODUCTS
                  </Text>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeScreenCat);

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

  ImageStyle: {
    padding: 10,
    margin: 5,
    height: 20,
    width: 20,
    resizeMode: 'stretch',
    alignItems: 'center',

  },
  starImageStyle: {
    width: 12,
    height: 12,
    marginRight: 2
  },

});
