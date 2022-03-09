import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
  ToastAndroid,
  ScrollView,
  Alert
} from 'react-native';
import CountDown from 'react-native-countdown-component';
import { imagePrefix } from '../constants/utils';
import { GetRating } from '../components/GetRating';
import AsyncStorage from '@react-native-community/async-storage';
import { GET_BID_ALL_PRODUCT, BID_ON_PRODUCT, CREATE_FAVOURITES_PRODUCT } from '../constants/queries';
import client from '../constants/client';
import Constants from "../constants/constant";
import Moment from 'moment';
import RNPickerSelect from 'react-native-picker-select';

const filterItems = [
  { label: 'Purchase', value: 'Buy' },
  { label: 'Bid', value: 'Bid' },
  { label: 'Hire', value: 'Hire' },
]

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
      starImageFilled:
        'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_filled.png',
      starImageCorner:
        'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_corner.png',

    };
  }

  componentDidMount() {
    this.fetchToken();
  }
  async fetchToken() {
    let token = await AsyncStorage.getItem('userToken');
    let userInfo = await AsyncStorage.getItem('userInfo');
    let IsLogin = await AsyncStorage.getItem('IsLogin');
    this.setState({
      userInfo: JSON.parse(userInfo),
    });
    this.setState({
      userTokenData: token
    });
    this.setState({
      userIsLogin: IsLogin
    });
    this.getAllBidProduct(token);
    console.log('token', token);
  }
  async addToFavourites(item) {
    console.log('addToFavourites', item)
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
  addBid(item) {
    this.setState({ bidIdicator: true })
    console.log('item>>>>>>>>', item)
    if (this.state.userIsLogin === 'true') {
      if (this.state.amount === '' || this.state.amount === undefined) {
        Alert.alert('Error', 'Enter Amount')
        return;
      }
      let dataLength = item.prdBid.length;
      let dataAmount = item.prdBid[dataLength - 1];
      if (dataAmount.bidAmount > this.state.amount) {
        Alert.alert('Error', 'Enter more than the last amount ')
        return;
      }
      client
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
            amount: this.state.amount,
            userId: Number(this.state.userInfo.id)
          },
        })
        .then(result => {
          this.setState({ cartLoading: false });
          console.log(result);
          Alert.alert('Success', 'Your Bid Number is - ' + result.data.createPrdBid.bidId)
          this.setState({ bidIdicator: false })
          // if (result.data.getPrdProductList.success) {
          //   this.setState({ data: result.data.getPrdProductList.result })
          //   this.setState({ setAllcartcount: result.data.getPrdProductList.count })
          // }
        })
        .catch(err => {
          this.setState({ cartLoading: false });
          console.log(err);
        });
    } else {
      this.props.navigation.navigate('Login')
    }
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
  getAllBidProduct = (Token) => {
    // this.setState({ cartLoading: false });
    client
      .mutate({
        mutation: GET_BID_ALL_PRODUCT,
        context: {
          headers: {
            Authorization: `Bearer ${Token}`,
            'Content-Length': 0,
          },
        },
      })
      .then(result => {
        this.setState({ cartLoading: false });
        console.log(result);
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
    let dataLength = item.prdBid.length;
    let data = item.prdBid[dataLength - 1];
    let bidAmount = 0;
    if (data === undefined) {
      bidAmount = 0;
    }
    if (data !== undefined) {
      bidAmount = data.bidAmount;
    }
    let date = item.endDate;
    // Moment()
    //     .utcOffset('+05:30')
    //     .format('YYYY-MM-DD hh:mm:ss');
    let expirydate = '2021-12-23 04:00:45';
    let diffr =
      Moment.duration(Moment(expirydate)
        .diff(Moment(date)));
    // Difference of the expiry date-time
    var hours = parseInt(diffr.asHours());
    var minutes = parseInt(diffr.minutes());
    var seconds = parseInt(diffr.seconds());

    // Converting in seconds
    var d = hours * 60 * 60 + minutes * 60 + seconds;
    const totalDurationData = d;
    // Settign up the duration of countdown
    // this.setState({ totalDuration: d });
    return (
      <View style={{ flex: 1, backgroundColor: '#fff', padding: 5, marginBottom: 40 }} key={index}>
        {/* <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          // alert('ttt')
          this.props.navigation.navigate('Details');
        }}
        style={{ marginBottom: 40 }}> */}
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: 5,
          }}>
          <View style={styles.mainCardView}>
            {/* <View style={styles.subCardView}> */}
            {/* <Image
              source={require('../assets/img/Rectangle.png')}
              resizeMode="contain"
              style={styles.proimg}
            /> */}
            <Image
              style={styles.proimg}
              source={{
                uri: `${imagePrefix}${item.productImage}`,
              }}
            />
            <View style={styles.subCardView}>
              <View style={{}}>
                <Text style={{ marginLeft: 10, width: "50%" }} numberOfLines={1}>{item.productName}</Text>
                <Text
                  style={{
                    marginTop: -20,
                    fontSize: 11,
                    alignSelf: 'flex-end',
                    marginRight: 52,
                  }}>
                  Last Bid Amount:
                </Text>
                {/* {item.prdBid.map((items, key) => { */}
                <Text
                  style={{
                    marginTop: -14,
                    fontSize: 11,
                    color: '#DB3236',
                    alignSelf: 'flex-end',
                    marginRight: 3,
                  }}>
                  R{bidAmount}
                </Text>
                {/* })} */}
                <Text
                  style={{
                    marginTop: -1,
                    fontSize: 11,
                    alignSelf: 'flex-end',
                    marginRight: 80,
                  }}>
                  Cut-off Date:
                </Text>
                {/* <Text
                  style={{
                    marginTop: -15,
                    fontSize: 11,
                    color: '#DB3236',
                    alignSelf: 'flex-end',
                    marginRight: 3,
                  }}> */}
                {/* {Moment(item.prdBid.createdDate).format('DD-MM-YYYY')} */}
                {/* </Text>  
                               */}
                <View style={{
                  marginTop: -15,
                  color: '#DB3236',
                  alignSelf: 'flex-end',
                  marginRight: 1,
                }}>
                  <CountDown
                    until={totalDurationData}
                    timetoShow={('H', 'M', 'S')}
                    timeLabels={{ h: null, m: null, s: null }}
                    size={7}
                  />

                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  paddingBottom: 20,
                  marginLeft: 10,
                }}>

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
              </View>
              <View>
                <Text style={styles.newdummyhead} numberOfLines={2}>
                  {item.description}
                </Text>
                {/* <Text
                  style={{
                    fontSize: 9,
                    color: 'gray',
                    textTransform: 'capitalize',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    marginBottom: 10,
                    marginTop: -11,
                    marginLeft: 10,
                  }}>
                  Lorem lpsum Semibold Vertigo{' '}
                </Text> */}
              </View>

              <View style={{ flex: 1, marginTop: 10, flexDirection: 'row' }}>
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      this.addToFavourites(item.productID)
                      // Alert.alert('hii');
                    }}
                    style={{ width: 30, marginLeft: 10 }}>
                    <Image
                      style={{
                        width: 20, height: 20, padding: 15,
                        // alignSelf: 'flex-start', 
                      }}
                      source={require('../assets/Bid1.png')}
                    />
                  </TouchableOpacity>
                </View>
                <View>
                  <TextInput
                    style={{
                      borderRadius: 5,
                      fontSize: 12,
                      borderColor: 'grey',
                      borderWidth: 1,
                      bottom: 25,
                      padding: 5,
                      height: 30,
                      marginLeft: 30,
                      marginRight: 30,
                      marginTop: 25,
                      width: 150
                    }}
                    placeholder="Enter Bid Amount"
                    placeholderTextColor="red"
                    onChangeText={text => {
                      this.setState({ amount: text });
                    }}
                    keyboardType="numeric"
                  />
                </View>
                <View>
                  <TouchableOpacity onPress={() => {
                    this.addBid(item)
                  }}>
                    <Image
                      style={{
                        width: 25,
                        height: 25,
                        padding: 15,
                        // alignSelf: 'flex-end',
                        marginRight: 20,
                      }}
                      source={require('../assets/Bid2.png')}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <View
                  style={{
                    borderWidth: 2,
                    height: 20,
                    width: 80,
                    borderColor: 'red',
                    borderTopLeftRadius: 5,
                    borderBottomLeftRadius: 5,
                    // marginTop: -15,
                    backgroundColor: '#FC595D',
                    alignSelf: 'center',
                    marginLeft: -79,
                  }}>
                  <Image source={require('../assets/img/DownArrow.png')} />
                  <Text
                    style={{
                      fontSize: 8,
                      color: '#FAFAFA',
                      alignSelf: 'flex-end',
                      marginTop: -10,
                    }}>
                    decrease bid {this.getPercentageChange(bidAmount, this.state.amount)}%
                  </Text>
                </View>
                <View
                  style={{
                    borderWidth: 2,
                    height: 20,
                    width: 80,
                    borderColor: '#38DF64',
                    borderTopRightRadius: 5,
                    borderBottomRightRadius: 5,
                    marginTop: -20,
                    backgroundColor: '#38DF64',
                    alignSelf: 'center',
                    marginRight: -79,
                  }}>
                  <Text
                    style={{
                      fontSize: 8,
                      color: '#FAFAFA',
                      alignSelf: 'flex-start',
                      marginTop: 3,
                    }}>
                    increase bid {this.getPercentageChangeIncrease(this.state.amount, bidAmount)}%
                  </Text>
                  <Image
                    style={{ alignSelf: 'flex-end', marginTop: -12 }}
                    source={require('../assets/img/upArrow.png')}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
        {/* </TouchableOpacity> */}
        {/* <View style={{ width: '100%', height: 1, backgroundColor: '#ABABAB' }} /> */}
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <ScrollView style={{ padding: 5, flex: 1 }}>
          <View style={styles.textinput}>
            <Image
              source={require('../assets/search.png')}
              resizeMode="contain"
              style={{
                height: 20,
                width: 20,
                marginTop: 10,
                marginLeft: 10,
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="Search Products"
              underlineColorAndroid="transparent"
            />
          </View>
          <View>
            <RNPickerSelect
              value={this.state.user}
              onValueChange={this.updateUser}
              items={filterItems}
              textInputProps={styles.pickerContainer}
            />
          </View>
          <View
            style={{
              justifyContent: 'center',
              padding: 18,
              alignItems: 'center',
              flex: 1,
            }}>
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
            />
          </View>
        </ScrollView>
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
    justifyContent: 'flex-start',
    marginBottom: 10,
    marginTop: -20,
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
});
