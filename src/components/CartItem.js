import React, { useState } from 'react'
import { StyleSheet, Text, View, Image, ToastAndroid, Platform } from 'react-native'
import InputSpinner from "react-native-input-spinner";
import { imagePrefix} from '../constants/utils';
import AsyncStorage from '@react-native-community/async-storage';
import client from '../constants/client';
import { UPDATE_SHOPPING_CART_NEW } from '../constants/queries';
import moment from 'moment';

const CartItem = ({ item }) => {
  const [amount, setAmount ] = useState(item.quantity);

  const { prdProduct } = item;
  const { salesTypeId, typeId } = prdProduct;

  const callUpdateCart = async (item, updatedQty) => {
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
          // ToastAndroid.show('Product added to cart', ToastAndroid.SHORT);
          console.log("Success!");
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  
  let quantityElement = <Text style={{fontSize: 13}}>Qty: {item.quantity}</Text>;

  if(typeId == 1 || (salesTypeId != 3 && typeId != 4)) {
    quantityElement = <InputSpinner
      max={100}
      min={1}
      step={1}
      colorMax={"#f04048"}
      colorMin={"#40c5f4"}
      value={amount}
      skin="clean"
      onChange={(num) => {
        setAmount(num);
        callUpdateCart(item, num);
      }}
      height={40}
      width={90}
      shadow={false}
    />;
  }
  return (
    <View style={styles.card}>
      <Image
        style={{width: 80, height: 100, marginLeft: 2, marginRight: 2}}
        source={ item.productImage ? {uri: `${imagePrefix}${item.productImage}`} : require('../assets/NoImage.jpeg') }
      />
      <View style={{ marginLeft: 20, height: 100 }}>
        <View>
          <Text style={{fontSize: 16}} numberOfLines={1}>
            {item.productName}
          </Text>
          <Text style={{fontSize: 14 }}>
            {item.categoryName}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, }}>
          <View>
            <Text style={{fontSize: 15, color: 'red'}}>
              R{item.unitCost.toFixed(2)}
            </Text>
            <Text style={{fontSize: 15, opacity: 0.5 }}>
              R{(item.unitCost * amount).toFixed(2)}
            </Text>
          </View>
          <View>
            { quantityElement }
          </View>
        </View>
      </View>
    </View>
  )
}

export default CartItem

const styles = StyleSheet.create({
  card: {
    height: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    elevation: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
})