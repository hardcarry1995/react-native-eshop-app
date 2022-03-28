import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import { GET_USER_TOP_BIDS, GET_SINGLE_PRODUCT } from '../constants/queries';
import client from '../constants/client';
import Constants from "../constants/constant";
import Moment from 'moment';
import { Rating } from "react-native-elements";

const MyBidScreen = ({ navigation }) => {
  const [topBids, setTopBids ] = useState([]);
  const [token, setToken] = useState(null);
  const [loading , setLoading] = useState(true);

  useEffect(() => {
    fetchToken();
  }, [])

  useEffect(() => {
    getUserTopBids();
  }, [token])

  const fetchToken = async () => {
    let token = await AsyncStorage.getItem('userToken');
    setToken(token);
}
  
  const getUserTopBids = () => {
    if(token === null ) return;
    client
      .query({
          query: GET_USER_TOP_BIDS,
          fetchPolicy: 'no-cache',
          context: {
              headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Length': 0,
              },
          },
      })
      .then( async result => {
        if(result.data.getUserTopBids.success){
          const bidData = result.data.getUserTopBids.result; 
          const bidDataWithProduct = await Promise.all(bidData.map(async (item, index) => {
            const data = await client.query({ 
              query: GET_SINGLE_PRODUCT, 
              fetchPolicy: 'no-cache',
              context:{
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Length': 0,
                },
              },
              variables: {
                productId: item.productID,
              },
            });
            return {product: data.data.getPrdProductList.result[0], bidDetail : item};
          }));
          setTopBids(bidDataWithProduct);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      })
  }

  const renderItems = ({item, index}) => {
    return (
      <TouchableOpacity key={index} onPress={() => { navigation.navigate('Filter', { data: item.product }); }} activeOpacity={0.9}>
        <View style={styles.main}>
          <View style={{ borderRightWidth : 1, borderRightColor : "#D0D0D0"}}>
            <Image style={styles.image} source={item.product.itemImagePath ? { uri: `${imagePrefix}${item.product.mapEflyersUploadDtos[0].documentName}` } : require('../assets/NoImage.jpeg')} />
          </View>
          <View style={{ paddingHorizontal: 10, paddingVertical: 10, borderRightWidth : 1, borderRightColor : "#D0D0D0"}}>
            <Text style={styles.text} numberOfLines={1}>{item.product.productName}</Text>
            <View style={{ alignItems: "flex-start", marginVertical: 5 }}>
              <Rating imageSize={12} readonly startingValue={item.product.ratingScore} />
            </View>
            <Text numberOfLines={2} style={{ color: '#323232', fontSize: 11, width: 200 }}>
              {item.product.description}
            </Text>
          </View>
          <View style={{ justifyContent: "center", alignItems: "center", paddingLeft : 10 }}>
            <Text style={{ fontSize: 11, color: "#323232", marginBottom : 10}}>Bid Amount</Text>
            <Text style={{fontWeight: '700', color: "red"}}>R{item.bidDetail.bidAmount.toFixed(2)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  fetchMoreItems = () => {

  }

  return (
   <View>
      <FlatList
        ListFooterComponent={() => {
          return (
            loading ? (
              <View style={{ padding: 10 }}>
                <ActivityIndicator size="large" color="#000" />
              </View>
            ) : null
          )
        }}
        keyExtractor={(item, i) => i}
        data={topBids}
        renderItem={renderItems}
        onEndReached={fetchMoreItems}
        onEndReachedThreshold={0.5}
      />
   </View>
  )
}

export default MyBidScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    height: 100,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowRadius: 20,
    elevation: 8,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 20,
    paddingVertical: 10,
    flexDirection: 'row',
  },
  image: {
    height: 72,
    width: 72,
  },
  text: {
    color: '#323232',
  },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#F54D30',
    height: 43,
    borderRadius: 5,
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
});
