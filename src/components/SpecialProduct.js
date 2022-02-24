import React, { Component, PureComponent } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image, Dimensions, ToastAndroid, FlatList, ActivityIndicator } from 'react-native';
import { GetRating } from './GetRating';
import { bearerToken, imagePrefix } from '../constants/utils';
import client from '../constants/client';
import { SPECIAL_PRODUCT, CREATE_FAVOURITES_SPECIAL } from '../constants/queries';
import AsyncStorage from '@react-native-community/async-storage';
import SQLite from 'react-native-sqlite-storage';

class SpecialProduct extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rating: "2",
      specialSize: 10,
      maxRating: [1, 2, 3, 4, 5],
      email: '',
      password: '',
      data: [],
      special_data_New: [],
      loading: false,
      userInfo: {},
      cartLoading: false,
      vdata: [],
      textnew: [],
      dataEMP: [],
      SQLiteProduct: [],
      queryText: '',
      userToken: '',
      search: '',
      specialDataNew: [],
      scan: false,
      ScanResult: false,
      result: null,
      starImageFilled:
        'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_filled.png',
      starImageCorner:
        'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_corner.png',
    }
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
    this.CreateTable();
    this.checkLogin();
    const allData = this.props
    this.setState({ special_data_New: allData.allData, specialDataNew: allData.allData })
    this.addCounrtyNew(allData.allData);
  }

  async addCounrtyNew(deta) {
    let countryDataNew = deta;
    let countryQueryNew = "INSERT INTO allSpecialDetailSQL( activeText , categoryID , categoryName,amount  ,specialDescription ,cityName ,imagePath,isActive ,specialID ,provinceName ,specialName, suburbID) VALUES";
    for (let i = 0; i < countryDataNew.length; ++i) {
      let dataid = i + 1;
      let escapedSample = countryDataNew[i].specialDescription.replace(/\'/g, "")
      countryQueryNew = countryQueryNew + "('"
        + countryDataNew[i].suburb //user_id
        + "','"
        + countryDataNew[i].categoryID //country_name
        + "','"
        + countryDataNew[i].categoryName //id
        + "','"
        + countryDataNew[i].amount //id
        + "','"
        + escapedSample  //country_name
        + "','"
        + countryDataNew[i].cityName //id
        + "','"
        + countryDataNew[i].imagePath //user_id
        + "','"
        + countryDataNew[i].isActive //country_name
        + "','"
        + countryDataNew[i].specialID //id
        + "','"
        + countryDataNew[i].provinceName //user_id
        + "','"
        + countryDataNew[i].specialName //country_name
        + "','"
        + countryDataNew[i].suburbID //is_deleted
        + "')";
      if (i != countryDataNew.length - 1) {
        countryQueryNew = countryQueryNew + ",";
      }
    }
    countryQueryNew = countryQueryNew + ";";
    await this.ExecuteQuery(countryQueryNew, []);

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
    await this.ExecuteQuery("CREATE TABLE IF NOT EXISTS allSpecialDetailSQL (activeText VARCHAR(16), categoryID INTEGER, categoryName VARCHAR(16),amount VARCHAR(16),specialDescription TEXT,cityName VARCHAR(225),imagePath VARCHAR(225),isActive VARCHAR(16),specialID INTEGER,provinceName VARCHAR(225),specialName VARCHAR(225), suburbID VARCHAR(225))", []);
  }

  async SelectQuery() {
    let selectQuery1 = await this.ExecuteQuery("SELECT * FROM allSpecialDetailSQL", []);
    var rows1 = selectQuery1.rows;
    for (let i = 0; i < rows1.length; i++) {
      var item1 = rows1.item(i)
      this.state.SQLiteProduct.push(item1);
    }
    const newArrayListNew = [];
    this.state.SQLiteProduct.forEach(obj => {
      if (!newArrayListNew.some(o => o.specialID === obj.specialID)) {
        newArrayListNew.push({ ...obj });
      }
    });

    this.setState({ special_data_New: newArrayListNew });
  }

  async addToFavourites(item) {
    let IsLogin = await AsyncStorage.getItem('IsLogin');
    if (IsLogin !== 'true') {
      this.props.navigation.navigate('Auth');
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
            ToastAndroid.show('Special added to Favourites', ToastAndroid.SHORT);
          }
        })
        .catch(err => {
          // this.setState({ cartLoading: false });
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
    this.fetchSpecialProduct(token)
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
          if (result.data.getMstSpecialList.success) {
            this.setState({ special_data_New: result.data.getMstSpecialList.result });
            this.setState({ specialDataNew: result.data.getMstSpecialList.result });
            this.addCounrtyNew(result.data.getMstSpecialList.result);
          } else {
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
  getrequestItem = () => {
    this.setState({ specialSize: this.state.specialSize + 10 });
    this.fetchSpecialProductNext();
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
          if (result.data.getMstSpecialList.result.length > 0) {
            this.setState({ special_data_New: result.data.getMstSpecialList.result });
            this.setState({ specialDataNew: result.data.getMstSpecialList.result });
          } else {
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  renderItemSpecial = ({ item, index }) => {
    let imagege = '';
    if (item.mapSpecialUpload.length > 0) {
      imagege = item.mapSpecialUpload[0].uploadPath;
    } else {
      imagege = '';
    }
    return (
      <TouchableOpacity activeOpacity={0.9} style={styles.itemContainer} key={index}>
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
                {item.specialName}
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
                        source={
                          item <= this.state.rating
                            ? { uri: this.state.starImageFilled }
                            : { uri: this.state.starImageCorner }
                        }
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.productPrice}>
                R {item.amount}
              </Text>
              <Text numberOfLines={2} style={{ color: '#BBB', marginTop: 5 }}>
                {item.specialDescription}
              </Text>
            </View>
            <View style={{ justifyContent: 'space-around', flexDirection: 'row', padding: 5 }}>
              <TouchableOpacity onPress={() => {
                this.addToFavourites(item.specialID)
              }}>
                <Image
                  style={{ height: 25, width: 25, tintColor: '#bbb' }}
                  source={require('../assets/heart.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { this.props.navigation.navigate('Categories20', { categoryId: item?.categoryID, subCategoryId: item?.categoryID, subCategoryName: item?.categoryName, title: item?.specialName, desc: item?.specialDescription, startdate: item?.startDate, mapSpecialUpload: item?.mapSpecialUpload }) }}>
                <Image
                  style={{ height: 35, width: 35, tintColor: '#DB3236', resizeMode: "center" }}
                  source={require('../assets/menu/request.png')}
                />
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
    marginBottom: 10
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
  }
});

export default SpecialProduct;
