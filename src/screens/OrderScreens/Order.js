import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import moment from 'moment';
import { imagePrefix } from '../../constants/utils';
import fileExtention from "file-extension";
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";
import Toast from "react-native-toast-message";

const Order = ({ route, ...props}) => {
  const { orderDate, orderAmount, orderIdstring, prdOrderStatus, prdOrderDetails } = route.params.order;
  const [ downloadingFile, setDownloadingFile ] = useState(false);

  downloadDocument = (mapDocument) => {
    const document = mapDocument[0];
    const file = {
      uploadPath : document.documentPath,
      ext: fileExtention(document.documentPath)
    }
    const fullUrl = `${imagePrefix}${file.uploadPath}`.replace("\\", "/");
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
    <View>
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
              <Image  
                source={ prdImagePath ? { uri : `${imagePrefix}${prdImagePath}`} : require('../../assets/NoImage.jpeg')}
                style={styles.productImage}
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
      </View>
    </View>
  )
}

export default Order

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