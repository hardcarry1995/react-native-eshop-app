import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator, Linking, ToastAndroid, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import client from '../../constants/client';
import { PACKAGE_LIST, PACKAGE_LIST_DETAIL } from '../../constants/queries';
import { Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';


export default class SetSubscriptionPlan extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      size: 10,
      data: [],
      dataDetail: [],
      loginToken: '',
      loading: false,
      selectedValue: '0'
    };
  }

  componentDidMount() {
    this.fetchToken();
    var value = 10.00;
    value = value.toFixed(0);
    Linking.getInitialURL().then((url) => {
      if (url) {
        this.handleOpenURL(url)
      }
    }).catch(err => { })
    Linking.addEventListener('url', this.handleOpenURL)
  }
  async fetchToken() {
    let token = await AsyncStorage.getItem('userToken');
    this.setState({
      loginToken: token
    });
    this.getPackage(token);
    this.getPackageDetail(token);

  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL)
  }

  async openGateWay() {
    let urlData = "https://sandbox.payfast.co.za/eng/process?merchant_id=10001460&merchant_key=0j4uaurpqk87v&return_url=https%3a%2f%2fwww.LawyersEzyFind.co.za%2fLCPayFastReturn.html&cancel_url=https%3a%2f%2fwww.LawyersEzyFind.co.za%2fLCPayFastCancel.html&notify_url=http%3a%2f%2fmobileapiv2.ezyfind.co.za%2fapi%2fUser%2fNotify%3f&m_payment_id=13216&amount=1151.70&item_name=Company+33&item_description=Purchased+EzyFindMobileApi.Model.MstPackage+Package&subscription_type=1&recurring_amount=1151.70&frequency=4&cycles=0";
    const url = urlData
    const canOpen = await Linking.canOpenURL(url)
    if (canOpen) {
      Linking.openURL(url)
    }
  }
  getDeepLink(path = '') {
    const scheme = 'my-demo'
    const prefix = Platform.OS === 'android' ? `${scheme}://demo/` : `${scheme}://`
    return prefix + path
  }

  async tryDeepLinking() {
    const redirectToURL = "https://sandbox.payfast.co.za/eng/process?merchant_id=10001460&merchant_key=0j4uaurpqk87v&return_url=https%3a%2f%2fwww.LawyersEzyFind.co.za%2fLCPayFastReturn.html&cancel_url=https%3a%2f%2fwww.LawyersEzyFind.co.za%2fLCPayFastCancel.html&notify_url=http%3a%2f%2fmobileapiv2.ezyfind.co.za%2fapi%2fUser%2fNotify%3f&m_payment_id=13223&amount=165000.00&item_name=fabtcy409+Company&item_description=Purchased+EzyFindMobileApi.Model.MstPackage+Package&subscription_type=1&recurring_amount=165000.00&frequency=4&cycles=0";
    const redirectUrl = this.getDeepLink('home')
    const url = `${redirectToURL}?redirect_url=${encodeURIComponent(redirectUrl)}`
    try {
      if (await InAppBrowser.isAvailable()) {
        const result = await InAppBrowser.openAuth(url, redirectUrl)
        await this.sleep(800)
        Alert.alert('Response', JSON.stringify(result))
      } else {
        // You can use Linking directly for iOS < 9
      }
    } catch (error) {
      Alert.alert('Something’s wrong with the app :(')
      console.log('error', error)
    }
  }
  // handle gateway callbacks
  handleOpenURL = (url) => {
    if (isSucceedPayment(url)) { // your condition
      // handle success payment
      console.log('handle success payment')
    } else {
      // handle failure
      console.log('handle failure payment')
    }
  }
  getPackage(token) {
    this.setState({ loading: true });
    client
      .query({
        query: PACKAGE_LIST,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      })
      .then(result => {
        this.setState({ loading: false });
        if (result.data.getMstPackageList.result.length > 0) {
          this.setState({ data: result.data.getMstPackageList.result });
          this.setState({ loading: false });
        } else {
          ToastAndroid.show(
            result.data.getMstPackageList.message,
            ToastAndroid.SHORT,
          );
          this.setState({ loading: false });
        }
      })
      .catch(err => {
        this.setState({ loading: false });
      });
  }
  getPackageDetail(token) {
    client
      .query({
        query: PACKAGE_LIST_DETAIL,
        variables: {
          id: 1,
        },
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      })
      .then(result => {
        this.setState({ loading: false });
        if (result.data.getMstPackageDetailList.result.length > 0) {
          this.setState({ dataDetail: result.data.getMstPackageDetailList.result });
        } else {
          ToastAndroid.show(
            result.data.getMstPackageDetailList.message,
            ToastAndroid.SHORT,
          );
        }
      })
      .catch(err => {
        this.setState({ loading: false });
        console.log('error>>>>>>', err);
      });
  }



  EmptyListMessage = ({ item }) => {
    return (
      <Text style={styles.emptyListStyle}>
        No Data Found
      </Text>
    );
  };

  renderItem = ({ item, index }) => {
    return (
      <View style={{ marginTop: 5 }} key={index}>
        <View style={{ height: 1, backgroundColor: '#FFE5E5', marginVertical: 25, marginRight: 30, marginLeft: 30 }} />
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Companyinfo', { detail: item, itemOff: this.state.selectedValue })}>
          <View style={styles.main}>
            <View style={{ borderRadius: 15, borderColor: '#E22727', borderWidth: 1, height: 60, backgroundColor: '#FFE5E5', }}>
              <View style={{
                marginTop: -20,
                padding: 5,
                alignContent: 'center',
                backgroundColor: '#E22727',
                color: 'white',
                width: 50,
                borderRadius: 40,
                alignSelf: 'center'
              }}>
                <Text style={{ textAlign: 'center', color: 'white' }}>{this.state.selectedValue}%</Text>
                <Text style={{ textAlign: 'center', color: 'white' }}>Off</Text>
              </View>
              <Text style={styles.text}>{item.packageName}</Text>
              {this.state.selectedValue == '0' &&
                <View>
                  <Text style={{ fontSize: 10, color: '#E22727', alignSelf: 'flex-end', opacity: 0.5, marginTop: -30, marginRight: '5%' }}>
                    {/* R{item.zeroOFF} */}
                  </Text>
                  <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#E22727', alignSelf: 'flex-end', marginRight: '5%', marginTop: -5, }}>
                    R {item.amount}
                  </Text>
                </View>
              }
              {this.state.selectedValue == '5' &&
                <View>
                  <Text
                    style={{
                      fontSize: 10,
                      color: '#E22727',
                      alignSelf: 'flex-end',
                      opacity: 0.5,
                      marginTop: -30,
                      marginRight: '5%',
                    }}>
                    R{item.threeMonths}
                  </Text>
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: 'bold',
                      color: '#E22727',
                      alignSelf: 'flex-end',
                      marginRight: '5%',
                      marginTop: -5,
                    }}>
                    R {item.fiveDiscount}
                  </Text>
                </View>
              }
              {this.state.selectedValue == '10' &&
                <View>
                  <Text
                    style={{
                      fontSize: 10,
                      color: '#E22727',
                      alignSelf: 'flex-end',
                      opacity: 0.5,
                      marginTop: -30,
                      marginRight: '5%',
                    }}>
                    R{item.sixMonths}
                  </Text>
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: 'bold',
                      color: '#E22727',
                      alignSelf: 'flex-end',
                      marginRight: '5%',
                      marginTop: -5,
                    }}>
                    R {item.tenDiscount}
                  </Text>
                </View>
              }
              {this.state.selectedValue == '15' &&
                <View>
                  <Text
                    style={{
                      fontSize: 10,
                      color: '#E22727',
                      alignSelf: 'flex-end',
                      opacity: 0.5,
                      marginTop: -30,
                      marginRight: '5%',
                    }}>
                    R{item.twelveMonths}
                  </Text>
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: 'bold',
                      color: '#E22727',
                      alignSelf: 'flex-end',
                      marginRight: '5%',
                      marginTop: -5,
                    }}>
                    R {item.fifteenDiscount}
                  </Text>
                </View>
              }
            </View>
            <View style={{ marginTop: 10, marginBottom: 10 }}>
              {/* <View>{this.getPackageDetail(item.packageID)}</View> */}
              {this.state.dataDetail.map((items, key) => {
                return (
                  <View>
                    {item.packageID == items.packageID &&
                      <View>
                         {items.attributeName !== 'Time Delay' &&
                        <Text
                          style={{
                            color: '#545454',
                            marginLeft: 29,
                            bottom: 0,
                            padding: 2,
                            opacity: 0.7,
                            fontSize: 12,
                            // marginTop: 10
                          }}>
                          {items.actualValue} {items.attributeName}
                        </Text>
                         }
                        {items.attributeName == 'Time Delay' &&
                          <View>
                            <Text
                              style={{
                                color: '#545454',
                                marginLeft: 29,
                                bottom: 0,
                                padding: 2,
                                opacity: 0.7,
                                fontSize: 12,
                                // marginTop: 10
                              }}>
                              {items.actualValue} Hrs {items.attributeName}
                            </Text>

                          </View>
                        }
                      </View>
                    }
                  </View>
                );
              })}
              <Image
                style={{
                  height: 31,
                  width: 30,
                  alignSelf: 'flex-end',
                  marginTop: -29,
                  marginRight: '5%',
                }}
                source={require('../../assets/Group422.png')}
              />
            </View>
            {/* <Image style={{height:45, width:45,}} source={require ('../assets/Group418.png')}/> */}
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <ScrollView>
        <View style={{ marginBottom: 40 }}>
          <View style={{
            borderWidth: 2,
            borderColor: '#F54D30',
            top: 30,
            borderRadius: 10,
            padding: 1,
            marginLeft: 25,
            marginRight: 25,
            marginBottom: 20,
            height: 45,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <RNPickerSelect
              value={this.state.selectedValue}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ selectedValue: itemValue })
              }
              items={[
                { label: '1 Month (0% Off)', value: '0' },
                { label: '3 Months (5% Off)', value: '5' },
                { label: '6 Months (10% Off)', value: '10' },
                { label: '12 Months (15% Off)', value: '15' },
              ]}
              textInputProps={styles.pickerContainer}
          />
          </View>
          <FlatList
            ListEmptyComponent={this.EmptyListMessage('data')}
            ListFooterComponent={() => {
              return (
                this.state.loading ? (
                  <ActivityIndicator size="large" color="#000" />
                ) : null
              )
            }}
            data={this.state.data.slice().sort((a, b) => a.amount - b.amount)}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
          />

        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    // height: 280,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowRadius: 20,
    elevation: 8,
    marginLeft: 26,
    marginRight: 26,
    marginTop: 5,

    // position:"absolute"
  },
  image: {
    height: 64,
    width: 64,
    marginTop: 17,
    marginLeft: 10,
  },
  text: {
    // marginLeft:110,
    // bottom:70,
    fontSize: 17,
    fontWeight: 'bold',
    color: '#323232',
    marginLeft: 20,
    marginTop: -3,
  },
  emptyListStyle: {
    marginTop: 25,
    textAlign: 'center',
  },
  pickerContainer: {
    textAlign: 'center',
    color: 'red',
    fontSize: 18
  },
});

// export default SetSubscriptionPlan;
