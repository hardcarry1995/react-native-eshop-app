import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import moment from 'moment';
import { imagePrefix } from '../../constants/utils';
import { GET_ORDER_STATUS } from "../../constants/queries";
import client from '../../constants/client';
import fileExtention from "file-extension";
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";
import Toast from "react-native-toast-message";
import ImageLoad from 'react-native-image-placeholder';
import Timeline from 'react-native-timeline-flatlist';
import { Icon } from 'react-native-elements'
import { connect } from "react-redux";

const Order = ({ route, ...props}) => {
  const { orderDate, orderAmount, orderIdstring, prdOrderStatus, prdOrderDetails } = route.params.order;
  const [ downloadingFile, setDownloadingFile ] = useState(false);
  const [ timelineData, setTimeline] = useState([]);
  const [orderStatus, setOrderStatus ] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = props.userState.user.token;
    setLoading(true);
    client
      .query({
        query : GET_ORDER_STATUS,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        },
      })
      .then(response => {
        const orderStatusData  = response.data.prdOrderStatusTypes.data;
        let data = orderStatusData.map((item) => ({
          id: item.orderStatusTypeId,
          time : null,
          title : item.statusName,
          circleColor : 'lightgrey',
          lineColor : 'lightgrey',
          sequenceId : item.statusSequence
        }));

        prdOrderStatus.map((item) => { 
          const { orderStatusTypeId, createdDate } = item;
          const index = data.findIndex(d => d.id == orderStatusTypeId);
          if(index === -1 ) return;
          data[index].time = moment(createdDate).format('h:mm A');
          data[index].icon = <Icon name='check' type="feather" color='#fff' size={20}  />;
          data[index].circleColor = orderStatusTypeId == 4 ? "red" : "#007AFF";
          data[index].lineColor = orderStatusTypeId == 4 ? "red" : "#007AFF";
          return null;
        });

        const paymentFailedIndex = data.findIndex(d => d.id == 4);
        if(data[paymentFailedIndex].time == null) {
          data = data.filter(d => d.id !== 4);
        }

        data.sort((a, b) => a.sequenceId > b.sequenceId);

        setTimeline(data);
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
      })
  }, [])

  downloadDocument = (mapDocument) => {
    const document = mapDocument[0];
    const file = {
      uploadPath : document.documentPath,
      ext: fileExtention(document.documentPath)
    }
    const fullUrl = `${imagePrefix}${file.uploadPath}`.replace("\\", "/").replaceAll(" ", "%20");
    const tempfilename = `temperary_${Date.now()}.${file.ext}`;
    const localFile = `${RNFS.DocumentDirectoryPath}/${tempfilename}`;
    const options = {
      fromUrl: fullUrl,
      toFile: localFile,
    };
    setDownloadingFile(true)
    RNFS.downloadFile(options)
      .promise
      .then((res) => {
        FileViewer.open(localFile)
      })
      .then(() => {
        // success
        console.log("Success")
        setDownloadingFile(false);
      })
      .catch((error) => {
        // error
        console.log(error.message);
        setDownloadingFile(false);
        Toast.show({
          type: 'error', 
          text1: "Error",
          text2: error.message
        })
      });
  }

  _onPressReturn = () => {
    props.navigation.goBack();
  }

  return (
    <ScrollView>
      <View style={styles.header}>
        <Text style={{ fontSize: 12, color: "#888"}}>Order : {orderIdstring}</Text>
        <View>
          <Text style={{ fontSize: 12, color: "#888"}}>Ordered: <Text style={{ color: "#333"}}>{moment(orderDate).format('ddd, Do MMM YYYY')}</Text></Text>
          <Text style={{ fontSize: 12, color: "#888", marginTop: 2}}>Total Price : <Text style={{ color: "red", }}>R {orderAmount.toFixed(2)}</Text></Text>
        </View>
      </View>
      <View style={styles.orderDetailsContainer}>
        <Text style={{ fontWeight: '600'}}>Order Details</Text>
        <View style={{ paddingTop: 15, borderBottomColor : "#ccc", borderBottomWidth: 1.5}}>
          {prdOrderDetails.map((prd, index) => {
            const { products, productPrice,  orderQuantity, ...others } = prd;
            let prdImagePath = null;
            if(products.mapProductImages.length > 0){
              prdImagePath = products.mapProductImages[0].imagePath;
            }

            return (<View key={index} style={styles.productContainer}>
              <ImageLoad  
                source={ prdImagePath ? { uri : `${imagePrefix}${prdImagePath}`} : require('../../assets/NoImage.jpeg')}
                style={styles.productImage}
                placeholderSource={require('../../assets/NoImage.jpeg')}
              />
              <View style={{ marginLeft: 10}}>
                <Text style={styles.productName} numberOfLines={1}>{products.productName}</Text>
                <Text style={styles.productPrice} >R {productPrice.toFixed(2)}</Text>
                <Text style={{ color: "#888", marginBottom : 5}}>Qty: {orderQuantity}</Text>
                {products.mapProductDocument.length > 0 && <TouchableOpacity onPress={() => downloadDocument(products.mapProductDocument)}>
                  <Text style={{ color: "#4D77FF", fontWeight : '600'}}>
                    Download Document
                    {downloadingFile && <ActivityIndicator size={12} style={{ marginLeft: 10}} /> }
                  </Text>
                </TouchableOpacity>}
              </View>
            </View>)
          })}
          <TouchableOpacity style={styles.returnButton} onPress={_onPressReturn}>
            <Text style={{ color: "#333", fontWeight: '600'}}>Return</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, marginTop : 20, marginBottom : 20}}>
          <Timeline  
            data={timelineData} 
            titleStyle={{ marginTop: -10, marginBottom: 30, fontSize : 20, fontWeight: '600'}}
            circleSize={30}
            timeStyle={{ marginTop: 5}}
            innerCircle={'icon'}
          />
        </View>
      </View>
    </ScrollView>
  )
}

const mapStateToProps = (state) => ({
  userState : state
})

export default connect(mapStateToProps, null)(Order);

const styles = StyleSheet.create({
  header : {
    padding: 10, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom : 10
  },
  orderDetailsContainer : {
    paddingHorizontal: 15, 
    paddingTop: 10, 
    backgroundColor: "#fff"
  },
  productContainer: {
    marginBottom: 15, 
    flexDirection: 'row', 
    borderBottomColor : "#ccc", 
    borderBottomWidth: 1.5, 
    paddingBottom: 15
  },
  productImage: {
    width: 80, 
    height: 80, 
    borderRadius :5, 
    marginRight: 5
  },
  productName: {
    fontSize: 14, 
    fontWeight: '600', 
    width: 250, 
    marginBottom: 5
  },
  productPrice: {
    color: "red", 
    fontWeight : '600', 
    marginBottom: 5
  },
  returnButton :{ 
    height: 40,
    width: 300, 
    borderWidth : 1, 
    borderRadius : 20, 
    borderColor : "#888", 
    justifyContent: 'center', 
    alignItems: 'center',
    alignSelf: 'center', 
    marginBottom : 20
  }

})