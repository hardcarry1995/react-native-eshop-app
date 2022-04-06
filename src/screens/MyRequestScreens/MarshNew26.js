import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, Dimensions, TextInput, FlatList, Modal, ToastAndroid, ActivityIndicator } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { REQUEST_ITEM_POST_RESPONSE, GET_RESPONSE_ITEMS } from '../../constants/queries';
import AsyncStorage from '@react-native-community/async-storage';
import client from '../../constants/client';

const Marsh26 = ({ navigation, route }) => {
  const [msgData, setmsgData] = useState([]);
  const [msgDataNew, setmsgDataNew] = useState([]);
  const [name_address, setname_address] = useState('');
  const [modalVisible, setmodalVisibler] = useState(false);
  const [token, SetToken] = useState('');
  const [resultdata, setUserInfo] = useState([]);
  const [jsondata, Setjsondata] = useState('');
  const [idTo, setIdData] = useState('');
  const [loading, setLoading] = useState(false);
  const [filePath, setFilePath] = useState('')
  const [fileName, setFileName] = useState(null)

  const requestData = route.params.requestData;

  useEffect(() => {
    getToken();
  }, []);

  const setModalVisible = visible => {
    setmodalVisibler(visible);
  };
  const getToken = async () => {
    let resultdata = await AsyncStorage.getItem('userInfo');
    setUserInfo(resultdata);
    let jsondata = JSON.parse(resultdata);
    let token = await AsyncStorage.getItem('userToken');
    SetToken(token)
    Setjsondata(jsondata)
    getRequestItemNext();
    setIdData(requestData.itemRequestID)
  }

  const requestItem = () => {
    if (name_address == '') {
      ToastAndroid.show('write something first', ToastAndroid.SHORT);
      return;
    }
    setLoading(true)
    client
      .mutate({
        mutation: REQUEST_ITEM_POST_RESPONSE,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        variables: {
          title: name_address,
          itemRequestId: requestData.itemRequestID,
          userId: Number(jsondata.id),
          filePath: filePath,
          fileName: fileName
        },
      })
      .then(async result => {
        if (result.data.postMstItemResponse.success) {
          setname_address('')
          setmsgDataNew([])
          let tdata = {
            comment: name_address,
            companyId: null,
            createdBy: null,
            createdDate: null,
            isAccepted: null,
            isActive: null,
            isRejected: null,
            itemRequestId: 11035,
            itemResponseId: 4302,
            mapItemResponseUpload: [
              {
                createdBy: null,
                createdDate: "2015-08-14T13:27:23.747",
                documentName: fileName,
                irUploadId: 1192,
                isActive: true,
                itemResponseId: 4456,
                modifiedBy: null,
                modifiedDate: null,
                uploadPath: filePath,
                __typename: "MapItemResponseUploadType"
              }
            ],
            modifiedBy: null,
            modifiedDate: null,
            replyToId: null,
            responseDate: "2015-06-23T17:35:44.68",
            userId: null
          };
          if (msgData.length > 0) {
            let i = -1;
            let j = msgData.length - 1;
            while (i != j) {
              i++;
              msgDataNew.push(msgData[i])
            }
          }
          msgDataNew.push(tdata)

          setmsgData(msgDataNew)
          setLoading(false)
        } else {
          Alert.alert('Failed', result.data.postMstItemResponse.message)
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  const showPDFOnClick = (item) => {
    navigation.navigate('ShowPDF', { pdfPath: item });
  }
  const getRequestItemNext = () => {
    let id = requestData.itemRequestID
    client
      .query({
        query: GET_RESPONSE_ITEMS,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        variables: {
          id: id,
        },
      })
      .then(async result => {
        if (result.data.getResponseItems) {
          setmsgData(result.data.getResponseItems);
        } else {
          Alert.alert('Failed', 'No Data Found')
        }
      })
      .catch(err => {
        console.log('REQUEST_ITEM_GET_RESPONSE Error', err);
      });
  };

  const selectFileDoc = async value => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.doc, DocumentPicker.types.xlsx, DocumentPicker.types.docx],
      });
      setFilePath(res.uri)
      setFileName(res.name)
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        alert('Canceled');
      } else {
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{ marginTop: 20, fontSize: 15 }}>
              Would you like to accept the offer
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClo]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.textStyle}>Purchase</Text>
                <Image
                  style={{
                    resizeMode: 'center',
                    height: 15,
                    width: 15,
                    marginTop: -17,
                    marginLeft: 10,
                  }}
                  source={require('../../assets/noun_Check.png')}
                />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.butt, styles.buttonClose]}
                onPress={() =>
                  navigation.goBack()}>
                <Text style={styles.textSty}>Decline</Text>
                <Image
                  style={{
                    resizeMode: 'center',
                    height: 15,
                    width: 15,
                    marginTop: -17,
                    marginLeft: 10,
                  }}
                  source={require('../../assets/cros.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <FlatList
        style={styles.list}
        data={msgData}
        keyExtractor={item => {
          return item.id;
        }}
        renderItem={comment => {
          const item = comment.item;
          let inMessage = '';
          let itemStyle = inMessage ? styles.itemIn : styles.itemOut;
          return (
            <View>
              <View style={styles.itemOut}>
                <View style={styles.balloon}>
                  <Text>{item.comment}</Text>
                </View>
              </View>
              {item.mapItemResponseUpload[0].documentName !== null && (
                <View style={{ alignSelf: 'flex-end' }}>
                  <TouchableOpacity onPress={() => showPDFOnClick(item.mapItemResponseUpload[0].uploadPath)}>
                    <View style={styles.itemOutNew}>
                      <View>
                        <Image
                          source={require('../../assets/PDFSHOW.png')}
                          style={{ width: 20, height: 20, marginRight: 5, marginTop: 0, resizeMode: 'contain' }}
                        />
                      </View>
                      <View >
                        <Text>{item.mapItemResponseUpload[0].documentName}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        }}
      />

      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputs}
            placeholder="Write a message..."
            underlineColorAndroid="transparent"
            value={name_address}
            onChangeText={name_address => setname_address(name_address)}
          />
          <TouchableOpacity onPress={() => selectFileDoc()}>
            <Image
              style={{ height: 24, width: 17, marginRight: 10 }}
              source={require('../../assets/M26_1.png')}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
              style={{ height: 22, width: 15, marginRight: 19 }}
              source={require('../../assets/M26_2.png')}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.btnSend}
          onPress={() => {
            requestItem();
          }}>
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Image
              source={require('../../assets/M26_3.png')}
              style={styles.iconSend}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginLeft: 16,
    flex: 1,
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
    elevation: 4,
    margin: 5,
    borderRadius: 15
  },
  itemOutNew: {
    flexDirection: 'row',
    backgroundColor: 'white',
    elevation: 5,
    padding: 12,
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
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    height: '20%',
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
  button: {
    borderRadius: 10,
    height: 30,
    width: 120,
    marginTop: 40,
    borderWidth: 1,
    borderColor: '#9F1D20',
  },
  butt: {
    borderRadius: 10,
    height: 30,
    width: 120,
    marginTop: 40,
    marginLeft: 20,
  },
  buttonClose: {
    backgroundColor: '#9F1D20',
  },

  textStyle: {
    color: '#232323',
    fontSize: 15,
    alignSelf: 'center',
    marginTop: 4,
    marginLeft: 10,
  },
  textSty: {
    color: '#FFFFFF',
    fontSize: 15,
    alignSelf: 'center',
    marginTop: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  }
});

export default Marsh26;