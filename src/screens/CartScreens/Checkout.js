import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Linking, ToastAndroid, FlatList, ActivityIndicator } from 'react-native';
import {bearerToken, imagePrefix} from '../../constants/utils';
import {RadioButton} from 'react-native-paper';
import RBSheet from 'react-native-raw-bottom-sheet';
import { GET_ADDRESS_LIST, purchaseShoppingCartAsync } from '../../constants/queries';
import AsyncStorage from '@react-native-community/async-storage';
import client from '../../constants/client';

export default class CheckOut extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cartLoading: false,
      loading: false,
      defaultAddress: {},
      totalCount: '0',
      alluserAddress: [],
      checked: '',
      checkoutLoading:false,
      userTokenData: '',
      userInfo: [],
    };
  }
  componentDidMount() {
    const { data, dataAll} = this.props.route.params;
    console.log("Data All:",  dataAll);
    this.setState({totalCount: data.length});
    this.interval = setInterval(() => this.getAddressUserInter(), 5000);
    this.getAddressUser();
    this.fetchToken();
    return () => {
        clearInterval(this.interval);
    }
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
  }

  async checkLogin() {
    let IsLogin = await AsyncStorage.getItem('IsLogin');
    if (IsLogin === 'true') {
        this.setState({ checkoutLoading: true });
        this.navigateToPurchaseURL();
    } else {
    }
  }

  async getAddressUser() {
    let token = await AsyncStorage.getItem('userToken');
    client
      .mutate({
        mutation: GET_ADDRESS_LIST,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      })
      .then(result => {
        if (result.data.getUserAddress.success) {
          this.setState({alluserAddress: result.data.getUserAddress.result});
          if (result.data.getUserAddress.count > 0) {
            this.setState({
              defaultAddress: result.data.getUserAddress.result[0],
            });
          }
        } else {
          ToastAndroid.show( result.data.getUserAddress.message, ToastAndroid.SHORT );
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  async getAddressUserInter() {
    let token = await AsyncStorage.getItem('userToken');
    client
      .mutate({
        mutation: GET_ADDRESS_LIST,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      })
      .then(result => {
        if (result.data.getUserAddress.success) {
          this.setState({alluserAddress: result.data.getUserAddress.result});
        } else {
          ToastAndroid.show( result.data.getUserAddress.message, ToastAndroid.SHORT);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  defaultDelAddView() {
    if (!Object.keys(this.state.defaultAddress).length > 0) {
    //   return <ActivityIndicator size="large" color="#000" />;
        return <Text style={{ color: "#888", textAlign: "center", marginVertical: 10 }}>No delivery address yet!</Text>
    }
    return (
        <TouchableOpacity style={{width: '95%',borderRadius: 8,borderColor: '#DB3236',borderWidth: 2,paddingRight: 25, margin:10}} onPress={() => this.RBSheet.open()}>
            <View style={{ marginRight:10 }}>
                <Image style={{width: 15, height: 15, top: 15, left: 10}} source={require('../../assets/img/checkmark.png')} />
                <Text style={{left: 33, bottom: 4}}>
                    {this.state.defaultAddress.streetAddress}
                </Text>
                <Text style={{left: 33, bottom: 4}}>
                    {this.state.defaultAddress.province}
                </Text>
                <Text numberOfLines={2} style={{left: 33, bottom: 4}}>
                    {this.state.defaultAddress.city} ,
                </Text>
                <Text numberOfLines={2} style={{left: 33, bottom: 4}}>
                    {this.state.defaultAddress.suburb},
                </Text>
                <Text style={{left: 33, bottom: 4, width: 145}} numberOfLines={1}>
                    {this.state.defaultAddress.zipCode}
                </Text>
            </View>
        </TouchableOpacity>
    );
  }

  renderItem = ({item, index}) => (
    <View style={styles.card}>
      <Image
        style={{width: 80, height: 100, marginLeft: 2, marginRight: 2}}
        source={ item.productImage ? {uri: `${imagePrefix}${item.productImage}`} : require('../../assets/NoImage.jpeg') }
      />
      <Text style={{fontSize: 16, left: 122, bottom: 110, width: '50%'}} numberOfLines={1}>
        {item.productName}
      </Text>
      <Text style={{fontSize: 14, left: 122, opacity: 0.5, bottom: 110}}>
        Dunlop
      </Text>
      <Text style={{fontSize: 15, left: 122, color: 'red', bottom: 100}}>
        R{item.unitCost.toFixed(2)}
      </Text>
      <Text style={{fontSize: 15, left: 122, opacity: 0.5, bottom: 95}}>
        R{(item.unitCost * item.quantity).toFixed(2)}
      </Text>
      <Text style={{fontSize: 13, marginLeft: 250, marginTop: -125}}>
        Qty: {item.quantity}
      </Text>
    </View>
  );

  alluserAddressSelectionView() {
    if(!this.state.alluserAddress.length > 0){
       return <ActivityIndicator size="large" color="#000" />;
    }
    return this.state.alluserAddress.map((item, i) => {
      return (
        <View
          key={i}
          style={{
            flexDirection: 'row',
            width: '100%',
            marginBottom: 20,
            marginHorizontal: 20,
          }}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <RadioButton
              value={item.userAddressID}
              status={
                this.state.checked === item.userAddressID
                  ? 'checked'
                  : 'unchecked'
              }
              onPress={() => {
                this.RBSheet.close();
                this.setState({checked: item.userAddressID});
                this.setState({defaultAddress: item});
              }}
            />
          </View>
          <View style={{width: '90%'}}>
            <Text style={{left: 33, bottom: 4}}>{item.streetAddress}</Text>
            <Text style={{left: 33, bottom: 4}}>
              {item.province}
            </Text>
            <Text numberOfLines={2} style={{left: 33, bottom: 4}}>
              {item.city}
              ,
            </Text>
            <Text style={{left: 33, bottom: 4}}>
              {item.suburb}
              ,{item.zipCode}
            </Text>
          </View>
        </View>
      );
    });
  }

  navigateToPurchaseURL() {
    client
      .mutate({
        mutation: purchaseShoppingCartAsync,
        context: {
          headers: {
            Authorization: `Bearer ${this.state.userTokenData}`,
            'Content-Length': 0,
          },
        },
        variables: {
          id: 5,
        },
      })
      .then( async response => {
        if (response?.data?.purchaseShoppingCartAsync?.success) {
          const url = response?.data?.purchaseShoppingCartAsync?.result?.paymentUrl;
           const canOpen = await Linking.canOpenURL(url);
           if (canOpen) {
            this.setState({ checkoutLoading: false });
            Linking.openURL(url)
          }
       }else{
         ToastAndroid.show(
           "Something went wrong",
           ToastAndroid.SHORT,
         );
       }
      })
      .catch(err => {
        console.log(err);
        this.setState({ checkoutLoading: false });
      });
  }

  render() {
    const {data, dataAll} = this.props.route.params;

    return (
      <View style={{backgroundColor: 'white', flex: 1}}>
        <ScrollView style={{flex: 1}}>
          <View>
            <TouchableOpacity style={styles.button} onPress={() => this.RBSheet.open() }>
              <Text style={styles.text}>+ Add Address</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 1, backgroundColor: 'grey', marginVertical: 30, marginHorizontal: 20, }} />
          <FlatList
            ListFooterComponent={() => {
              return (
                this.state.loading && (
                  <ActivityIndicator size="large" color="#000" />
                )
              );
            }}
            keyExtractor={(item, i) => i.toString()}
            data={data}
            renderItem={this.renderItem}
          />

          <View style={{ height: 1, backgroundColor: 'grey', marginVertical: 30, marginHorizontal: 20, }}/>

          <View>
            <Text style={{fontSize: 15, left: 17}}>Delivery Option</Text>
          </View>
          {this.defaultDelAddView()}
          <View
            style={{ height: 1, backgroundColor: 'grey', marginVertical: 15, marginHorizontal: 20,}}
          />

          <View>
            <Text style={{alignSelf: 'flex-end', marginRight: 60, bottom: 12}}>
              {this.state.totalCount} Item(s), Total: &nbsp;
            </Text>
            <Text style={{ alignSelf: 'flex-end', marginRight: 20, bottom: 29, color: '#DB3236', }}>
              &nbsp;R{dataAll.amountExlVat.toFixed(2)}
            </Text>
            <Text style={{alignSelf: 'flex-end', marginRight: 20, bottom: 25}}>
              Price dropped, Saved: R00.00
            </Text>
          </View>

          <View style={{ height: 1, backgroundColor: 'grey', marginVertical: 0, marginHorizontal: 20, }} />

          <View>
            <Text style={{marginLeft: 17}}>
              Subtotal ( {this.state.totalCount} items)
            </Text>
            <Text style={{marginLeft: 17}}>Shipping Fee</Text>
            <Text style={{ bottom: 35, color: '#DB3236', alignSelf: 'flex-end', marginRight: 22, }}>
              R{dataAll.amountExlVat.toFixed(2)}
            </Text>
            <Text style={{ bottom: 35, color: '#DB3236', alignSelf: 'flex-end', marginRight: 22, }}>
              R{dataAll.vatAmount.toFixed(2)}
            </Text>
          </View>

          <View style={{ backgroundColor: '#DB3236', height: 70, bottom: 1, padding: 8}}>
            <Text style={{fontSize: 20, color: '#FAFAFA', marginLeft: 12}}>
              Total:R {dataAll.totalAmount.toFixed(2)}
            </Text>
            <Text
              style={{fontSize: 12, color: '#E19191', top: 3, marginLeft: 12}}>
              VAT included, where applicable
            </Text>

            <TouchableOpacity onPress={() =>  this.checkLogin()} disabled={this.state.checkoutLoading}
              style={{borderRadius: 10,height: 50,bottom: 40,width: 125,alignSelf: 'flex-end',marginRight: 12,backgroundColor: this.state.checkoutLoading ? '#ccc' : '#FF7175'}}>
              <Text style={{ fontSize: 15, color: '#FAFAFA', alignItems: 'center', left: 9, top: 12 }}>
                Proceed to Pay
              </Text>
            </TouchableOpacity>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 100, }}>
              <RBSheet ref={ref => { this.RBSheet = ref; }}
                closeOnDragDown={false}
                openDuration={250}
                customStyles={{
                  container: {
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                  },
                }}>
                <TouchableOpacity
                  style={styles.button2}
                  onPress={() => {
                    this.RBSheet.close();
                    this.props.navigation.navigate('AddAddress');
                  }}>
                  <Text style={styles.text2}>Add New Address</Text>
                </TouchableOpacity>
                <ScrollView
                  contentContainerStyle={{width: '100%', marginTop: 20}}>
                  {this.alluserAddressSelectionView()}
                </ScrollView>
              </RBSheet>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#F3E1E1',
    padding: 10,
    marginTop: 30,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: '#DB3236',
    marginLeft: 40,
    marginRight: 40,
  },
  text: {
    color: '#db3236',
    fontSize: 20,
  },
  button2: {
    alignItems: 'center',
    backgroundColor: '#F3E1E1',
    padding: 10,
    marginTop: 30,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: 'white',
    marginLeft: 40,
    marginRight: 40,
  },
  text2: {
    color: '#db3236',
    fontSize: 17,
  },
  card: {
    height: 120,
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    elevation: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    left: 20,
    marginBottom: 20,
  },
});
