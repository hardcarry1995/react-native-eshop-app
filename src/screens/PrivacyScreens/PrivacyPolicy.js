import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  ToastAndroid,
  Modal,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-datepicker';
import { imagePrefix } from '../../constants/utils';
import { GetRating } from '../../components/GetRating';
import AsyncStorage from '@react-native-community/async-storage';
import { HIRE_THE_PRODUCT, GET_ALL_HIRE_PRODUCT, CREATE_FAVOURITES_PRODUCT, HIRE_THE_PRODUCT_NULL } from '../../constants/queries';
import client from '../../constants/client';
import Constants from "../../constants/constant";
import Moment from 'moment';
import { Alert } from 'react-native';
import { Icon } from 'native-base';
import RNPickerSelect from 'react-native-picker-select';

const filterItems = [
  { label: 'Purchase', value: 'Buy' },
  { label: 'Bid', value: 'Bid' },
  { label: 'Hire', value: 'Hire' },
]
export default class PrivacyPolicy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: 'Hire',
      cartLoading: true,
      userInfo: [],
      userTokenData: '',
      data: [],
      userIsLogin: 'false',
      bidIdicator: false,
      amount: '',
      rating: "2",
      hireData: {},
      modalVisible: false,
      fromDate: Moment().format('YYYY-MM-DD'),
      toDate: Moment().format('YYYY-MM-DD'),
      todayDate: '',
      totalDuration: '0',
      maxRating: [1, 2, 3, 4, 5],
      starImageFilled:
        'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_filled.png',
      starImageCorner:
        'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_corner.png',

    };
  }

  componentDidMount() {
    this.fetchToken();
    const todayDate = Moment().format('YYYY-MM-DD');
    this.setState({ todayDate: todayDate })
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
    this.getAllHireProduct(token);
    console.log('hire token', token);
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
  hireTheProduct(visible) {
    // this.setModalVisible(!modalVisible)
    console.log('data', this.state.hireData);
    if (this.state.fromDate === '' || this.state.fromDate === undefined) {
      ToastAndroid.show(
        'Select start date',
        ToastAndroid.SHORT,
      );
      return;
    }
    if (this.state.toDate === '' || this.state.toDate === undefined) {
      ToastAndroid.show(
        'Select end date',
        ToastAndroid.SHORT,
      );
      return;
    }
    if (this.state.fromDate === this.state.toDate) {
      ToastAndroid.show(
        'Invalid Date',
        ToastAndroid.SHORT,
      );
      return;
    }
    if (this.state.fromDate > this.state.toDate) {
      ToastAndroid.show(
        'Invalid date',
        ToastAndroid.SHORT,
      );
      return;
    }
    if (this.state.userIsLogin === 'true') {
      client
        .mutate({
          mutation: HIRE_THE_PRODUCT,
          context: {
            headers: {
              Authorization: `Bearer ${this.state.userTokenData}`,
              'Content-Length': 0,
            },
          },
          variables: {
            productId: this.state.hireData.productID,
            userId: Number(this.state.userInfo.id),
            fromDate: this.state.fromDate + ' 18:30:00.000',
            toDate: this.state.toDate + ' 18:30:00.000'
          },
        })
        .then(result => {
          this.setState({ cartLoading: false });
          console.log(result);
          if (result.data.postPrdShoppingCartOptimized.success) {
            Alert.alert('Success', 'Hire product successfully')
          }

          this.setState({ modalVisible: visible });
          this.setState({ bidIdicator: true })
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
      client
        .mutate({
          mutation: HIRE_THE_PRODUCT_NULL,
          context: {
            headers: {
              Authorization: `Bearer ${this.state.userTokenData}`,
              'Content-Length': 0,
            },
          },
          variables: {
            productId: this.state.hireData.productID,
            fromDate: this.state.fromDate + ' 18:30:00.000',
            toDate: this.state.toDate + ' 18:30:00.000'
          },
        })
        .then(result => {
          this.setState({ cartLoading: false });
          console.log(result);
          if (result.data.postPrdShoppingCartOptimized.success) {
            Alert.alert('Success', 'Hire product successfully')
          }

          this.setState({ modalVisible: visible });
          this.setState({ bidIdicator: true })
        })
        .catch(err => {
          this.setState({ cartLoading: false });
          console.log(err);
        });
    }
  }
  setModalVisible = visible => {
    console.log(visible);
    this.setState({ modalVisible: visible });
  };
  SetTheItemClick(item) {
    this.setState({ hireData: item })
    console.log('item>>>>', item);

  }

  getAllHireProduct = (Token) => {
    client
      .mutate({
        mutation: GET_ALL_HIRE_PRODUCT,
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
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 5 }} key={index}>
      <View
        style={{ marginBottom: 10 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: '#FFF',
            borderColor: '#ccc',
            borderRadius: 15,
            borderWidth: 1,
            elevation: 8,
          }}>
          <View style={{ alignSelf: 'center', flex: 1 }}>
            {/* <Image
              style={{height: 100, width: 100, padding: 5, marginVertical: 5}}
              source={require('../assets/img/Rectangle.png')}
            /> */}
            <TouchableOpacity
              onPress={() => {
                this.setModalVisible(true)
                this.SetTheItemClick(item)
              }}>
              <Image
                style={{ height: 100, width: 100, padding: 5, marginVertical: 5 }}
                source={{
                  uri: `${imagePrefix}${item.productImage}`,
                }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              borderColor: '#eeeeee',
              borderRadius: 15,
              borderWidth: 1,
            }}>
            <TouchableOpacity
              onPress={() => {
                this.setModalVisible(true)
                this.SetTheItemClick(item)
              }}>
              <View style={{ flexDirection: 'column', marginLeft: 10, margin: 10 }}>
                <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }} numberOfLines={1}>
                  {item.productName}
                </Text>
                {/* <CountDown
                until={this.state.totalDuration}
                //duration of countdown in seconds
                timetoShow={('H', 'M', 'S')}
                //formate to show
                // onFinish={() => alert('finished')}
                //on Finish call
                // onPress={() => alert('hello')}
                //on Press call
                size={20}
              /> */}
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    paddingTop: 1,
                    paddingBottom: 5,
                    alignSelf: 'flex-start',
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
                  <Text
                    style={{
                      fontSize: 10,
                      marginLeft: 25,
                      color: '#9f1d20',
                      fontWeight: 'bold',
                      // textTransform: 'capitalize',
                      // flexDirection: 'row', justifyContent: 'flex-end',
                      marginTop: -3,
                    }}>
                    R {item.unitCost}
                  </Text>
                </View>
                <Text numberOfLines={2} style={{ color: '#BBB' }}>
                  {item.description}
                </Text>
              </View>
            </TouchableOpacity>
            <View
              style={{
                justifyContent: 'space-around',
                flexDirection: 'row',
                padding: 5,
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.addToFavourites(item.productID)
                }}>
                <Image
                  style={{ height: 25, width: 25, tintColor: '#bbb' }}
                  source={require('../../assets/heart.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.setModalVisible(true)
                  this.SetTheItemClick(item)
                  // alert('ttt')
                  // this.props.navigation.navigate('HireProduct');
                  // onPress={() => this.setModalVisible(true)}
                }}>
                <Image
                  style={{ height: 23, width: 23, tintColor: '#DB3236' }}
                  source={require('../../assets/img/wacht.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      {/* <View style={{ width: '100%', height: 1, backgroundColor: '#ABABAB' }} /> */}
    </View>
  );

  render() {

    const { modalVisible } = this.state;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
        }}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />

        <ScrollView style={{ padding: 5, flex: 1 }}>
          <View style={styles.textinput}>
            {/* <Icon style={styles.searchIcon} name="ios-search" size={20} color="#000"/> */}
            <Image
              source={require('../../assets/search.png')}
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
              padding: 21,
              alignItems: 'center',
              flex: 1,
            }}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                // Alert.alert('Modal has been closed.');
                this.setModalVisible(!modalVisible);
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <TouchableOpacity style={styles.iconclose}
                    onPress={() => {
                      this.setModalVisible(false)
                    }}>
                    <Icon name="close" size={20} color="#000" />
                  </TouchableOpacity>
                  {/* <Image
                    style={{ marginTop: 10, height: 120, width: 120 }}
                    source={require('../assets/img/Rectangle.png')}
                  /> */}
                  <Image
                    style={{ marginTop: 10, height: 120, width: 120 }}
                    source={{
                      uri: `${imagePrefix}${this.state.hireData.productImage}`,
                    }}
                  />
                  <View style={{ backgroundColor: '#FAFAFA', width: '100%', padding: 10 }}>
                    <View style={{ alignItems: 'center', marginTop: 10 }}>
                      <Text style={{ fontSize: 14, textAlign: 'center', fontWeight: 'bold', width: '40%' }} numberOfLines={2} >Set Time Period for hire</Text>
                    </View>
                    <View style={{ flexDirection: 'row', paddingStart: 10, marginTop: 10 }}>
                      <View style={{ width: '40%' }}>
                        <Text style={{ fontSize: 12, color: 'black' }}>Start Date</Text>
                      </View>
                      <View style={{ width: '20%' }}>
                      </View>
                      <View style={{ width: '40%' }}>
                        <Text style={{ fontSize: 12, color: 'black' }}>End Date</Text>
                      </View>
                    </View>

                    <View style={{ flexDirection: 'row', paddingStart: 10 }}>
                      <View style={{ width: '40%' }}>
                        <DatePicker
                          style={{ width: '90%', color: 'red' }}
                          date={this.state.fromDate}
                          mode="date"
                          format="YYYY-MM-DD"
                          minDate={this.state.todayDate}
                          maxDate="2050-06-01"
                          confirmBtnText="Confirm"
                          cancelBtnText="Cancel"
                          customStyles={{
                            dateIcon: {
                              position: 'absolute',
                              left: 0,
                              top: 4,
                              height: 0,
                              width: 0,
                              marginLeft: 0
                            },
                            dateInput: {
                              borderRadius: 9,
                              color: 'red'
                            }
                          }}
                          onDateChange={(date) => { this.setState({ fromDate: date }) }}
                        />
                      </View>
                      <View style={{ width: '20%' }}>
                        <Text style={{ textAlign: 'center', fontSize: 20 }}>-</Text>
                      </View>
                      <View style={{ width: '40%' }}>
                        <DatePicker
                          style={{ width: '90%' }}
                          date={this.state.toDate}
                          mode="date"
                          format="YYYY-MM-DD"
                          minDate={this.state.todayDate}
                          maxDate="2050-06-01"
                          confirmBtnText="Confirm"
                          cancelBtnText="Cancel"
                          customStyles={{
                            dateIcon: {
                              position: 'absolute',
                              left: 0,
                              top: 4,
                              height: 0,
                              width: 0,
                              marginLeft: 0
                            },
                            dateInput: {
                              borderRadius: 9,
                            }
                          }}
                          onDateChange={(date) => { this.setState({ toDate: date }) }}
                        />
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', paddingStart: 10, marginTop: 15 }}>
                      <View style={{ width: '40%' }}>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={{ fontSize: 12, color: 'black' }}>Days: </Text>
                          {this.state.toDate === '' &&
                            <Text style={{ fontSize: 12, color: '#DB3236', fontWeight: 'bold' }}>0</Text>
                          }
                          {this.state.toDate !== '' &&
                            <Text style={{ fontSize: 12, color: '#DB3236', fontWeight: 'bold' }}>
                              {Moment(this.state.toDate).diff(this.state.fromDate, 'days')}</Text>
                          }
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={{ fontSize: 12, color: 'black' }}>Total: </Text>
                          {this.state.toDate === '' &&
                            <Text style={{ fontSize: 12, color: '#DB3236', fontWeight: 'bold' }}>R{this.state.hireData.unitCost}</Text>
                          }
                          {this.state.toDate !== '' &&
                            <Text style={{ fontSize: 12, color: '#DB3236', fontWeight: 'bold' }}>R {this.state.hireData.unitCost * Moment(this.state.toDate).diff(this.state.fromDate, 'days')}</Text>
                          }
                        </View>
                      </View>
                      <View style={{ width: '20%' }}>
                      </View>
                      <View style={{ width: '40%' }}>
                        <TouchableOpacity
                          style={styles.buttonClose}
                          onPress={() => this.hireTheProduct(!modalVisible)
                          }>
                          <Text style={styles.textStyle}>HIRE</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                  </View>
                </View>
              </View>
            </Modal>
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
            // ListEmptyComponent={this.ListEmpty}
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
    // width: '88%',
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
    // height: '55%',
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonClose: {
    backgroundColor: '#DB3236',
    color: 'white',
    width: '70%',
    borderRadius: 7,
    padding: 5,
    marginLeft: 8
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  iconclose: {
    position: 'absolute',
    top: 0,
    right: 10,
    bottom: 0
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
