import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, StatusBar, TouchableOpacity, TextInput, ActivityIndicator, FlatList, ToastAndroid, ScrollView, Alert} from 'react-native';
import CountDown from 'react-native-countdown-component';
import { imagePrefix } from '../constants/utils';
import { GetRating } from '../components/GetRating';
import AsyncStorage from '@react-native-community/async-storage';
import { GET_BID_ALL_PRODUCT, BID_ON_PRODUCT, CREATE_FAVOURITES_PRODUCT } from '../constants/queries';
import client from '../constants/client';
import Constants from "../constants/constant";
import Moment from 'moment';
import RNPickerSelect from 'react-native-picker-select';
import CategorySelector from "../components/CategorySelector";
import { Chip } from "react-native-elements";
import ProductSearchInput from "../components/ProductSearchInput";
import Toast from "react-native-toast-message";

const filterItems = [
  { label: 'Purchase', value: 'Buy' },
  { label: 'Bid', value: 'Bid' },
  { label: 'Hire', value: 'Hire' },
]

function BidItem ({ item, onPressAddBid, onPressAddToFav }) {

  const [ lastBidAmount, setLastBidAmount ] = useState(0);
  const [totalDurationData, setTotalDurationData ] = useState(0);
  const [amount, setAmount ] = useState(0);
  const [rating, setRating ] = useState(0);
  const [disableDecrease, setDisableDecrease ] = useState(false);
  
  const maxRating =[1, 2, 3, 4, 5];
  const starImageFilled = 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_filled.png';
  const starImageCorner = 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_corner.png';

  useEffect(() => {
    const dataLength = item.prdBid.length;
    const data = item.prdBid[dataLength - 1];
    if (data === undefined) {
      setLastBidAmount(0);
    } else {
      setLastBidAmount(data.bidAmount);
      setAmount(data.bidAmount.toFixed(2));
    }

    const  date = item.endDate;
    // Moment()
    //     .utcOffset('+05:30')
    //     .format('YYYY-MM-DD hh:mm:ss');
    const expirydate = '2021-12-23 04:00:45';
    const diffr = Moment.duration(Moment(expirydate) .diff(Moment(date)));
    // Difference of the expiry date-time
    const hours = parseInt(diffr.asHours());
    const minutes = parseInt(diffr.minutes());
    const seconds = parseInt(diffr.seconds());
    // Converting in seconds
    const d = hours * 60 * 60 + minutes * 60 + seconds;
    setTotalDurationData(d);

  }, []);

  useEffect(() => {
    if(amount <= lastBidAmount) {
      setDisableDecrease(true);
    } else {
      setDisableDecrease(false);
    }
  }, [amount, lastBidAmount])
  
  const _onPressAddBid = async () => {
    if (amount === '' || amount === undefined) {
      Alert.alert('Error', 'Enter Amount')
      return;
    }
    let dataLength = item.prdBid.length;
    let dataAmount = item.prdBid[dataLength - 1];
    if (dataAmount.bidAmount > amount) {
      Alert.alert('Error', 'Enter more than the last amount ')
      return;
    }
    const result = await onPressAddBid(item, amount);
    if(result){
      setLastBidAmount(parseFloat(amount));
    }
  }

  const decrease = () => {
    if(disableDecrease) {
      // alert("Bid amount should be bigger that last bid amount!");
      return;
    }
    var changeValue = lastBidAmount * 0.1;
    setAmount(prevState => (parseFloat(prevState) - changeValue).toFixed(2));
  }

  const increase = () => {
    var changeValue = lastBidAmount * 0.1;
    if(amount !== 0) {
      setAmount(prevState => ((parseFloat(prevState) + changeValue)).toFixed(2));
    } else {
      setAmount((lastBidAmount + changeValue).toFixed(2));
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 5, marginBottom: 40 }}>
      <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', marginTop: 5 }}>
        <View style={styles.mainCardView}>
          <Image style={styles.proimg} source={{ uri: `${imagePrefix}${item.productImage}`}} />
          <View style={styles.subCardView}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ marginLeft: 10, }} numberOfLines={1}>{item.productName}</Text>
              <View style={{  marginLeft: 10, }}>
                <GetRating companyId={item.productID} onprogress={(Rating) => { setRating(Rating); }} />
                <View style={{ flexDirection: "row", padding: 1, paddingBottom: 5, }}>
                  {maxRating.map((item, key) => {
                    return (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        key={item}
                      >
                        <Image
                          style={styles.starImageStyle}
                          source={ item <= item.ratingScore ? { uri: starImageFilled } : { uri: starImageCorner }}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
            <View style={{ flexDirection: 'row', marginVertical: 5, justifyContent: 'space-between', alignItems: 'center', paddingHorizontal : 10}}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',}}>
                <Text style={{ fontSize: 11,}}> Last Bid Amount: </Text>
                <Text style={{ fontSize: 11, color: '#DB3236',  marginRight: 3 }}>
                  R{lastBidAmount.toFixed(2)}
                </Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Text style={{ fontSize: 11}}>
                  Cut-off Date:
                </Text>
                {totalDurationData > 0 && <CountDown
                  until={totalDurationData}
                  timetoShow={('H', 'M', 'S')}
                  timeLabels={{ h: null, m: null, s: null }}
                  size={7}
                />}
              </View>
            </View>
            <View>
              <Text style={styles.newdummyhead} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
            <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-around' }}>
              <TouchableOpacity onPress={onPressAddToFav} style={{ width: 30, marginLeft: 10 }}>
                <Image style={{ width: 15, height: 15, padding: 15 }} source={require('../assets/Bid1.png')} />
              </TouchableOpacity>
              <TextInput
                style={{ borderRadius: 5, fontSize: 12, borderColor: 'grey', borderWidth: 1, bottom: 25, padding: 5, height: 30, marginLeft: 30, marginRight: 30, marginTop: 25, width: 150 }}
                placeholder="Enter Bid Amount"
                placeholderTextColor="red"
                onChangeText={text => {
                 setAmount(isNaN(parseFloat(text)) ? 0 : parseFloat(text));
                }}
                value={amount === 0 ? "" : amount.toString()}
                keyboardType="numeric"
              />
              <TouchableOpacity onPress={_onPressAddBid}>
                <Image style={{ width: 25, height: 25, padding: 15, marginRight: 20 }} source={require('../assets/Bid2.png')}/>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: "row", justifyContent: "center", marginBottom : 20}}>
              <TouchableOpacity 
                style={{ 
                  ...styles.decreaseBtn, 
                  backgroundColor: disableDecrease ? "lightgrey" : styles.decreaseBtn.backgroundColor,
                  borderColor: disableDecrease ? "lightgrey" : styles.decreaseBtn.backgroundColor
                }} 
                activeOpacity={disableDecrease ? 1 : 0.5}
                onPress={decrease} 
              >
                <Image source={require('../assets/img/DownArrow.png')} />
                <Text style={{ fontSize: 10, color: '#FAFAFA'}}>
                  decrease bid by 10%
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={{...styles.increaseBtn}} 
                onPress={increase}
                activeOpacity={0.5}
              >
                <Text style={{ fontSize: 10, color: '#FAFAFA'}}>
                  increase bid by 10%
                </Text>
                <Image source={require('../assets/img/upArrow.png')} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}


export default class SettingsScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: 'Bid',
      cartLoading: true,
      userInfo: [],
      userTokenData: '',
      data: [],
      userIsLogin: '',
      bidIdicator: false,
      amount: '',
      rating: "2",
      maxRating: [1, 2, 3, 4, 5],
      showCategorySelector: false,
      categoriesForSearch : [],
      searchText : "",
      refreshing: false
    };
  }

  componentDidMount() {
    this.fetchToken();
  }
  fetchToken = async () => {
    let token = await AsyncStorage.getItem('userToken');
    let userInfo = await AsyncStorage.getItem('userInfo');
    let IsLogin = await AsyncStorage.getItem('IsLogin');
    this.setState({ userInfo: JSON.parse(userInfo) });
    this.setState({ userTokenData: token });
    this.setState({ userIsLogin: IsLogin });
    this.getAllBidProduct(token);
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
              // 'Content-Length': 0,
            },
          },
        })
        .then(result => {
          if (result.data.createMstFavourites.mstFavouriteId) {
            Toast.show({
              type: 'success',
              text1: 'Success', 
              text2: "Product has been added to the favorites list!",
            });
          } else {
            Toast.show({
              type: "error",
              text1: "Error!",
              text2 : "Something went wrong! Please try again later!"
            })
          }
        })
        .catch(err => {
          console.log(err);
          Toast.show({
            type: "error",
            text1: "Error!",
            text2 : "Something went wrong! Please try again later!"
          })
        });
    }
  }
  getPercentageChangeIncrease(oldNumber, newNumber) {
    // console.log('test',oldNumber, newNumber)
    if (oldNumber > newNumber) {
      var decreaseValue = oldNumber - newNumber;
      return (decreaseValue / oldNumber) * 100;
    }
    return 0;
  }
  getPercentageChange(oldNumber, newNumber) {
    // console.log('test>>>>>',oldNumber, newNumber)
    if (oldNumber > newNumber) {
      var decreaseValue = oldNumber - newNumber;
      return (decreaseValue / oldNumber) * 100;
    }
    return 0;
  }

  async addBid(item, amount) {
    this.setState({ bidIdicator: true })
    if (this.state.userIsLogin === 'true') {
      try{
        await client
        .mutate({
          mutation: BID_ON_PRODUCT,
          context: {
            headers: {
              Authorization: `Bearer ${this.state.userTokenData}`,
              'Content-Length': 0,
            },
          },
          variables: {
            productId: item.productID,
            amount: parseFloat(amount),
            userId: Number(this.state.userInfo.id)
          },
        })
        this.setState({ cartLoading: false });
        this.setState({ bidIdicator: false });
        Toast.show({
          type: 'success',
          text1: 'Success', 
          text2: "Your bid has been applied sucessfully!",
        });
        return true;
      }catch(err){
        this.setState({ cartLoading: false });
        Toast.show({
          type: "error",
          text1: "Error!",
          text2 : "Something went wrong! Please try again later!"
        })
        console.log(err);
        return false;
      }
    } else {
      this.props.navigation.navigate('AuthStack')
    }
  }
  getAllBidProduct = async (Token, catIds = '') => {
    let categoryIdsJson = await AsyncStorage.getItem('categories');
    client
      .query({
        query: GET_BID_ALL_PRODUCT,
        fetchPolicy: 'no-cache',
        variables: {
          categories: (catIds == "" || catIds == null) ? categoryIdsJson : catIds
        },
        context: {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        },
      })
      .then(result => {
        this.setState({ cartLoading: false });
        if (result.data.getPrdProductList.success) {
          this.setState({ data: result.data.getPrdProductList.result })
          this.setState({ setAllcartcount: result.data.getPrdProductList.count })
        }
      })
      .catch(err => {
        this.setState({ cartLoading: false });
        console.log(err);
      });
  }

  renderItem = ({ item, index }) => {
   return <BidItem  item={item} key={index} onPressAddBid={(item, amount) => this.addBid(item, amount)} onPressAddToFav={() => this.addToFavourites(item.productID)} />
  }
  filterItems = (keyword) => {
    this.setState({ searchText: keyword});
    let filtered = [...this.state.data];
    if(keyword !== ""){
      filtered = filtered.filter(item => item.productName.toLowerCase().includes(keyword.toLowerCase()));
    }
    this.setState((prevState) => {
      return {
        ...prevState,
        filteredData : filtered
      }
    })
  }
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
      const catIds = categories.map(cat => cat.categoryId).join(",");
     this.getAllBidProduct(this.state.userTokenData, catIds);
  }

  refreshList = () => {
    this.setState({ refreshing : true });
    this.fetchToken();
    this.setState({ refreshing : false });
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        <View style={{ padding: 5, flex: 1 }}>
          <ProductSearchInput 
            onChangeText={(search) => this.filterItems(search)} 
            onPressFilterIcon={() => this.setState({ showCategorySelector : true})} 
          />
          {this.state.categoriesForSearch.length > 0 && <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom : 20, paddingHorizontal : 10 }}>
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
          <View>
          </View>
          <View style={{ justifyContent: 'center', padding: 18, alignItems: 'center', flex: 1 }}>
            <FlatList
              style={{ flex: 1, width: '100%', marginBottom: -17 }}
              showsVerticalScrollIndicator={false}
              data={this.state.data}
              renderItem={this.renderItem}
              ListFooterComponent={() => {
                return (
                  this.state.cartLoading ? (
                    <View style={{ padding: 10 }}>
                      <ActivityIndicator size="large" color="#000" />
                    </View>
                  ) : null
                )
              }}
              onRefresh={this.refreshList}
              refreshing={this.state.refreshing}
            />
          </View>
        </View>
        <CategorySelector 
          visible={this.state.showCategorySelector} 
          onDone={(values) => this._onSelectCategoryDone(values)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 0.8,
  },
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
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'red',
    padding: 100,
  },
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  searchIcon: {
    padding: 1,
  },
  input: {
    paddingLeft: 0,
    backgroundColor: '#fff',
    color: '#424242',
    marginLeft: 50,
    marginTop: -30,
    width: '80%',
    height: 40,
  },
  textinput: {
    borderRadius: 10,
    fontSize: 12,
    borderColor: '#9f1d20',
    borderWidth: 1,
    margin: 20,
    padding: 5,
    height: 50,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  mainCardView: {
    height: '100%',
    width: '98%',
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
    // flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingLeft: 2,
    // paddingRight: 2,
    marginTop: 10,
    // marginBottom:4,
    marginLeft: 16,
    marginRight: 16,
  },
  subCardView: {
    height: '60%',
    borderRadius: 8,
    backgroundColor: 'white',
    borderColor: '#eeeeee',
    borderWidth: 1,
    borderStyle: 'solid',
  },
  prohead: {
    fontSize: 10,
    marginLeft: 10,
    color: '#9f1d20',
    fontWeight: 'bold',
    textTransform: 'capitalize',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: -3,
  },
  dummyhead: {
    marginTop: 10,
    width: 100,
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    textTransform: 'capitalize',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  newdummyhead: {
    fontSize: 9,
    color: 'gray',
    textTransform: 'capitalize',
    flexDirection: 'row',
    marginBottom: 10,
    marginLeft: 10,
  },
  proimg: {
    height: 90,
    width: 90,
    alignSelf: 'center',
    padding: 10,
    marginTop: 10,
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
  decreaseBtn : {
    borderWidth: 2,
    height: 25,
    width: 130,
    borderColor: 'red',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    backgroundColor: '#FC595D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  increaseBtn : {
    borderWidth: 2,
    height: 25,
    width: 130,
    borderColor: '#38DF64',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: '#38DF64',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  }
});
