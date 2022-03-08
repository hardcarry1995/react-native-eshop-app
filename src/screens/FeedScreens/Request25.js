import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, SafeAreaView, ScrollView } from 'react-native';
import { imagePrefix } from '../../constants/utils';
import Moment from 'moment';
import { GET_RESPONSE_ITEMS } from '../../constants/queries';
import AsyncStorage from '@react-native-community/async-storage';
import client from '../../constants/client';

const Request25 = ({ navigation }) => {

  const data = navigation.getParam('data');
  { console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>data____", data) }

  const dateDMY = Moment(data.itemRequestDate).format('DD-MMM-YYYY');
  { console.log('dateDMY', imagePrefix) }
  const [vehicleData, setVehicleData] = useState([]);
  const [name_address, setname_address] = useState('');
  useEffect(() => {
    getRequestItem();
    // setAllPDF(setPDF);
  });
  const getRequestItem = async () => {
    let IsLogin = await AsyncStorage.getItem('IsLogin');
    if (IsLogin !== 'true') {
      navigation.navigate('Auth');
    } else {
      let resultdata = await AsyncStorage.getItem('userInfo');
      let jsondata = JSON.parse(resultdata);
      let token = await AsyncStorage.getItem('userToken');
      console.log('resultdata', resultdata);

      let id = data.itemRequestID
      // console.log('variablesDAta', variablesDAta);

      client
        .query({
          query: GET_RESPONSE_ITEMS,
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
              // 'Content-Length': 0,
            },
          },
          variables: {
            id: id,
          },
        })
        .then(async result => {
          console.log('result REQUEST_ITEM_GET_RESPONSE>>>', result)
          if (result.data.getResponseItems) {
            setVehicleData(result.data.getResponseItems[0]);
          } else {
            Alert.alert('Failed', 'No Data Found')
          }
        })
        .catch(err => {
          console.log('REQUEST_ITEM_GET_RESPONSE Error', err);
        });
    }
  };


  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <View>
            {/* <Image
              style={{ height: 190, width: 200, alignSelf: 'center' }}
              source={require('../assets/R25.png')}
            /> */}
            <Image
              style={{ height: 190, width: 200, alignSelf: 'center' }}
              source={data.itemImagePath
                ?
                { uri: `${imagePrefix}${data.itemImagePath}` }
                :
                require('../../assets/NoImage.jpeg')}
            />
          </View>
          <View style={{}}>
            <View style={styles.main}>
              <View>
                <Text style={{ color: '#9F1D20', fontSize: 21, padding: 15 }}>

                  {data.itemRequestTitle}
                </Text>
                <Text style={{ color: '#232323', marginLeft: 15, fontSize: 15 }}>
                  Request Date
                </Text>
                <Text
                  style={{ marginLeft: 135, marginTop: -20, color: '#C9C9C9' }}>

                  {dateDMY}
                </Text>
                <Text
                  style={{
                    color: '#232323',
                    marginLeft: 15,
                    fontSize: 15,
                    marginTop: 20,
                  }}>
                  Category Details
                </Text>
                <Text
                  style={{
                    color: '#E22727',
                    marginLeft: 15,
                    fontSize: 15,
                    opacity: 0.7,
                  }}>
                  {data.itemCategory}
                </Text>
                {/* <Text
                  style={{
                    color: '#232323',
                    marginLeft: 80,
                    fontSize: 15,
                    marginTop: -20,
                  }}>
                  {'>>'}
                </Text>
                <Text
                  style={{
                    color: '#E22727',
                    marginLeft: 100,
                    fontSize: 15,
                    marginTop: -20,
                    opacity: 0.7,
                  }}>
                  {data.itemCategory}
                </Text> */}
                {/* <Text
                  style={{
                    color: '#232323',
                    marginLeft: 179,
                    fontSize: 15,
                    marginTop: -20,
                  }}>
                  {'>>'}
                </Text> */}
                {/* <Text
                  style={{
                    color: '#E22727',
                    marginLeft: 199,
                    fontSize: 15,
                    marginTop: -20,
                    opacity: 0.7,
                  }}>
                  Spare Parts
                </Text>
                <Text style={{ color: '#232323', marginLeft: 15, fontSize: 15 }}>
                  {'>>'}
                </Text> */}
                {/* <Text
                  style={{
                    color: '#E22727',
                    marginLeft: 35,
                    fontSize: 15,
                    marginTop: -20,
                    opacity: 0.7,
                  }}>
                  Volks
                </Text> */}
                <Text
                  style={{
                    color: '#232323',
                    marginLeft: 15,
                    fontSize: 15,
                    marginTop: 18,
                  }}>
                  Status Request
                </Text>
                <Text
                  style={{
                    color: '#2CD826',
                    marginLeft: 140,
                    fontSize: 15,
                    marginTop: -20,
                  }}>
                  {data.itemRequestStatus}
                </Text>
                <Text
                  style={{
                    color: '#232323',
                    marginLeft: 15,
                    fontSize: 15,
                    marginTop: 18,
                  }}>
                  Description
                </Text>
                <Text
                  style={{
                    color: '#C9C9C9',
                    marginLeft: 15,
                    fontSize: 15,
                    marginTop: -2,
                  }}>

                  {data.itemRequestDescription}
                </Text>
                {data.suburb !== null &&
                  <View>
                    <Text
                      style={{
                        color: '#232323',
                        marginLeft: 15,
                        fontSize: 15,
                        marginTop: 18,
                      }}>
                      Suburb
                    </Text>
                    <Text
                      style={{
                        color: '#C9C9C9',
                        marginLeft: 140,
                        fontSize: 15,
                        marginTop: -20,
                      }}>
                      {data.suburb}
                    </Text>
                  </View>
                }
                {data.suburb === null &&
                  <View>
                    <Text
                      style={{
                        color: '#232323',
                        marginLeft: 15,
                        fontSize: 15,
                        marginTop: 18,
                      }}>
                      Suburb
                    </Text>
                    <Text
                      style={{
                        color: '#C9C9C9',
                        marginLeft: 140,
                        fontSize: 15,
                        marginTop: -20,
                      }}>
                      Not Provide
                    </Text>
                  </View>
                }
              </View>
            </View>
          </View>

          <View style={{}}>
            <View style={styles.main2}>
              <View>
                <Text style={{ color: '#9F1D20', fontSize: 21, padding: 15 }}>
                  Selected Company
                </Text>

                {data.selectedCompany === null &&
                  <Text style={{
                    color: '#232323',
                    fontSize: 16,
                    padding: 15,
                    marginTop: -20,
                  }}>
                    No Selected Company
                  </Text>
                }
                {data.selectedCompany !== null &&
                  <Text style={{
                    color: '#232323',
                    fontSize: 16,
                    padding: 15,
                    marginTop: -20,
                  }}>
                    {data.selectedCompany}
                  </Text>
                }
              </View>
            </View>
          </View>

          <View style={{ marginBottom: 40 }}>
            <View style={styles.main3}>
              <View>
                <Text style={{ color: '#9F1D20', fontSize: 21, padding: 15 }}>
                  Responses({vehicleData == '' || vehicleData == undefined ? '0' : '1'})
                  {/* ({ vehicleData!==''? vehicleData.length:1}) */}
                </Text>
                {vehicleData == undefined &&
                  <View>
                    <View style={styles.footer}>
                      <View style={styles.inputContainer}>
                        <TextInput
                          style={styles.inputs}
                          placeholder="Write a message..."
                          underlineColorAndroid="transparent"
                          value={name_address}
                          onChangeText={name_address => setname_address(name_address)}
                        />
                      </View>

                      <TouchableOpacity style={styles.btnSend}
                        onPress={() => {
                          navigation.navigate('MarshNew26', { requestData: data });
                        }}>
                        <Image
                          source={require('../../assets/M26_3.png')}
                          style={styles.iconSend}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                }

                {/* ------- */}

                {vehicleData !== undefined &&
                  <View>
                    <Text
                      style={{
                        color: '#232323',
                        fontSize: 17,
                        padding: 15,
                        marginTop: -20,
                        marginLeft: 10,
                      }}>
                      Marsh
                    </Text>
                    <Text
                      style={{
                        color: '#232323',
                        fontSize: 15,
                        padding: 15,
                        marginTop: -23,
                        marginLeft: 10,
                        opacity: 0.7,
                      }}>
                      {vehicleData == '' || vehicleData == undefined ? 'Hello' : vehicleData.comment}
                    </Text>

                    <Image
                      style={{
                        height: 10,
                        width: 10,
                        marginTop: -63,
                        marginLeft: 77,
                      }}
                      source={require('../../assets/R25_1.png')}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('MarshNew26', { requestData: data });
                      }}>
                      <Image
                        style={{
                          height: 20,
                          width: 20,
                          alignSelf: 'flex-end',
                          marginRight: 20,
                        }}
                        source={require('../../assets/R25_2.png')}
                      />
                    </TouchableOpacity>
                  </View>
                }
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: 'white',
    borderRadius: 15,
    shadowRadius: 20,
    elevation: 8,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 20,
    paddingBottom: 10
  },
  main2: {
    height: 105,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowRadius: 20,
    elevation: 8,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 20,
  },
  main3: {
    height: 145,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowRadius: 20,
    elevation: 8,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 20,
  },
  list: {
    paddingHorizontal: 17,
  },
  footer: {
    flexDirection: 'row',
    height: 60,
    paddingHorizontal: 10,
    padding: 5,
  },
  btnSend: {
    backgroundColor: 'white',
    width: 40,
    height: 40,
    borderRadius: 360,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSend: {
    width: 30,
    height: 30,
    alignSelf: 'center',
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  inputs: {
    height: 40,
    marginLeft: 6,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 15,
    flex: 1,
    paddingLeft: 10
  },
  balloon: {
    maxWidth: 250,
    padding: 15,
    borderRadius: 20,
  },
  itemIn: {
    alignSelf: 'flex-start',
  },
  itemOut: {
    alignSelf: 'flex-end',
    backgroundColor: 'lightblue',
    margin: 5,
    borderRadius: 15
  },
  time: {
    alignSelf: 'flex-end',
    margin: 15,
    fontSize: 12,
    color: '#808080',
  },
  item: {
    marginVertical: 14,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F9E5E5',
    borderRadius: 20,
    padding: 5,
    marginRight: 150,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    marginTop: -10,
    // backgroundColor:"#7A7A7A",
    // opacity:0.8
  },
});

export default Request25;
