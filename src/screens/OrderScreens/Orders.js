import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import client from '../../constants/client';
import { GET_ORDERS_BY_USER } from '../../constants/queries';
import Toast from "react-native-toast-message";
import { imagePrefix } from '../../constants/utils';
import RBSheet from "react-native-raw-bottom-sheet";
import RadioButtonRN from 'radio-buttons-react-native';
import ImageLoad from 'react-native-image-placeholder';

const Orders = (props) => {

  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [page, setPage ] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filterItems, setFilterItems] = useState([]);
  const [filterOption, setFilterOption] = useState(1);

  let RBSheetRef = useRef();

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    RBSheetRef.close();
    if(filterItems.length === 0) return;
    const filterItem = filterItems[filterOption - 1];
    let fromDate = null;
    let toDate = null;
    if(filterItem.value == 0){
      fromDate = null;
      toDate = null;
    }
    else if(filterItem.value == 3){
      toDate = moment().format();
      fromDate = moment().subtract(3,'months').format();
    } else if (filterItem.value == 6){
      toDate = moment().format();
      fromDate = moment().subtract(6, 'months').format();
    } else {
      const year = filterItem.value;
      fromDate = moment(`${year}-01-01`).format();
      toDate = moment(`${year}-12-31`).format();
    }
    setLoading(true);
    getOrders(token, null, fromDate, toDate);
  }, [filterOption])

  const init = async () => {
    setLoading(true);
    const accesstoken = await AsyncStorage.getItem('userToken');
    const userInfo = await AsyncStorage.getItem('userInfo');
    setToken(accesstoken);
    setUserInfo(userInfo);
    getOrders(accesstoken);
    const filterData = [
      { label : "All Items", value : 0 },
      { label : "Last 3 months", value : 3},
      { label : "Last 6 months", value : 6},
    ];
    const year = new Date().getFullYear();
    for(let i = 0; i < 3; i ++){
      filterData.push({ label: (year - i).toString(), value: year - i});
    }
    setFilterItems(filterData);
  }

  const getOrders = async (accesstoken, orderStatusTypeId = null, fromDate = null, toDate = null) => {
    client
      .query({
        query : GET_ORDERS_BY_USER,
        context: {
          headers: {
            Authorization: `Bearer ${accesstoken}`,
          }
        },
        variables: {
          orderStatusTypeId : orderStatusTypeId,
          fromDate: fromDate,
          toDate: toDate,
          page: 1
        },
      })
      .then(response => {
        const { count, currentPage, message, nextPage, prevPage, success, totalPages, result } = response.data.prdOrdersByUser;
        if(success){
          setTotalCount(count);
          setPage(nextPage);
          setOrders(result);
        } else {
          Toast.show({ 
            type: "error",
            text1: "Error!",
            text2: "Somethig went wrong!"
          })
        }
        setLoading(false)
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
      })
  }

  _onPressOrder = (order) => {
    props.navigation.navigate('Order', { order: order });
  }

  _renderOrderItem = ({item, index}) => {
    const { orderDate, orderAmount, orderIdstring, prdOrderStatus } = item;
    const orderDetails = item.prdOrderDetails;
    let lastStatusName = '';
    if(prdOrderStatus.length > 0){
      const lastStatus = prdOrderStatus[prdOrderStatus.length - 1];
      lastStatusName = lastStatus.prdOrderStatusType[0].statusName;
    }
    
    return (
      <TouchableOpacity style={styles.orderContainer} onPress={() => _onPressOrder(item)} key={orderIdstring}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom : 10 }}>
          <Text style={{ fontSize: 16, fontWeight : '600'}}>{orderIdstring}</Text>
          <Text style={{ fontSize: 16, fontWeight : '600'}}>{moment(orderDate).format(" ")}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom : 10 }}>
          <Text style={{ fontWeight: "bold", color: "#333", fontSize: 12}}>Order Amount: <Text style={{ color: "red"}}>R {orderAmount.toFixed(2)}</Text></Text>
          <Text style={{ fontSize: 12, color: "#333", fontWeight: "bold" }}>{lastStatusName}</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          {orderDetails.map(order => {
            const { products } = order;
            let prdImagePath = null;
            if(products.mapProductImages.length > 0){
              prdImagePath = products.mapProductImages[0].imagePath;
            }
            return (
              <ImageLoad  
                source={ prdImagePath ? { uri : `${imagePrefix}${prdImagePath}`} : require('../../assets/NoImage.jpeg')}
                style={{ width: 80, height: 80, borderRadius :5, marginRight: 5 }}
                placeholderSource={require('../../assets/NoImage.jpeg')}
              />
            )
          })}
          
        </View>
        
      </TouchableOpacity>
    )
  }

  _onPressFilterChange = () => {
    if(RBSheetRef){
      RBSheetRef.open();
    }
  }

  onChangeFilter = (e) => {
    const index = filterItems.findIndex(f => f.value == e.value);
    setFilterOption(index + 1);
  }

    return(
      <View style={styles.container}>
        <View style={styles.filterContainer}>
          <View style={{ flexDirection: "row"}}>
            <Text>Filter Orders:</Text>
            <Text style={{ fontWeight : '600', marginLeft: 10, color : "#333"}}>{filterItems.length > 0 ? filterItems[filterOption - 1].label : "All Item"}</Text>
          </View>
          <TouchableOpacity onPress={_onPressFilterChange}>
            <Text style={{ color: "#4B7BE5", fontWeight : '700'}}>Change</Text>
          </TouchableOpacity>
        </View>
        <FlatList 
          data={orders}
          keyExtractor={item => item.orderId}
          renderItem={this._renderOrderItem}
          ListEmptyComponent={loading ? <ActivityIndicator  />  : <Text style={{ textAlign: 'center' }}>No record found!</Text>}
        />

        <RBSheet ref={ref => RBSheetRef = ref} height={400} openDuration={250}>
          <ScrollView style={{ paddingHorizontal: 10}}>
            <RadioButtonRN
              data={filterItems}
              selectedBtn={(e) => onChangeFilter(e)}
              initial={filterOption}
            />
          </ScrollView>
        </RBSheet>
      </View>
    )
}

export default Orders;


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
  },
  filterContainer: {
    paddingVertical : 15,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom : 20,
    alignItems: "center"
  },
  filterItem : {
    flexDirection: "row", 
    paddingHorizontal: 10, 
    alignItems: "center",
    paddingVertical: 10, 
    borderBottomColor : "#888",
    borderBottomWidth : 1
  }
})