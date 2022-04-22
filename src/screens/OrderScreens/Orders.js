import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import client from '../../constants/client';
import { GET_ORDERS_BY_USER } from '../../constants/queries';
import Toast from "react-native-toast-message";
import { imagePrefix } from '../../constants/utils';

export default class Orders extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      orders: [],
      token : "",
      userInfo: null,
      page: 1, 
      totalCount : 0
    }
  }

  componentDidMount() {
    this.init();
  }

  init = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const userInfo = await AsyncStorage.getItem('userInfo');
    this.setState({ token : token, userInfo: userInfo });
    this.getOrders(token);
  }

  getOrders = async (token) => {
    client
      .query({
        query : GET_ORDERS_BY_USER,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        },
        variables: {
          orderStatusTypeId : null,
          fromDate: null,
          toDate: null,
          page: 1
        },
      })
      .then(response => {
        const { count, currentPage, message, nextPage, prevPage, success, totalPages, result } = response.data.prdOrdersByUser;
        console.log(count);
        if(success){
          this.setState(prevState => ({ 
            totalCount: count, 
            page: nextPage,
            orders: [...prevState.orders, ...result]
          }));
        } else {
          Toast.show({ 
            type: "error",
            text1: "Error!",
            text2: "Somethig went wrong!"
          })
        }
      })
  }

  _onPressOrder = (order) => {
    this.props.navigation.navigate('Order', { order: order });
  }

  _renderOrderItem = ({item, index}) => {
    const { orderDate, orderAmount, orderIdstring, prdOrderStatus } = item;
    const orderDetails = item.prdOrderDetails;
    return (
      <TouchableOpacity style={styles.orderContainer} onPress={() => this._onPressOrder(item)}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom : 10 }}>
          <Text style={{ fontSize: 16, fontWeight : '600'}}>{orderIdstring}</Text>
          <Text style={{ fontSize: 16, fontWeight : '600'}}>{moment(orderDate).format(" ")}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom : 10 }}>
          <Text>Order Amount: <Text style={{ color: "red"}}>R{orderAmount.toFixed(2)}</Text></Text>
          <Text>Status : </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          {orderDetails.map(order => {
            const { products } = order;
            let prdImagePath = null;
            if(products.mapProductImages.length > 0){
              prdImagePath = products.mapProductImages[0].imagePath;
              console.log(prdImagePath);
            }
            return (
              <Image  
                source={ prdImagePath ? { uri : `${imagePrefix}${prdImagePath}`} : require('../../assets/NoImage.jpeg')}
                style={{ width: 80, height: 80, borderRadius :5, marginRight: 5 }}
              />
            )
          })}
          
        </View>
        
      </TouchableOpacity>
    )
  }

  render(){
    return(
      <View style={styles.container}>
        <FlatList 
          data={this.state.orders}
          keyExtractor={item => item.orderId}
          renderItem={this._renderOrderItem}
        />
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    flex: 1
  },
  orderContainer: {
    backgroundColor: "#fff", 
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 10
  }
})