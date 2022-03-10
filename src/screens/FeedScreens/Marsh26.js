import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  TextInput,
  FlatList,
  Modal,
  PermissionsAndroid,
  ToastAndroid,
  ActivityIndicator
} from 'react-native';
import RNFetchBlob from 'react-native-blob-util';
import DocumentPicker from 'react-native-document-picker';
import { REQUEST_ITEM_POST_RESPONSE, GET_RESPONSE_ITEMS, GET_RESPONSE_ITEMS_NEW } from '../../constants/queries';
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
  const [source, setsource] = useState({ uri: 'http://samples.leanpub.com/thereactnativebook-sample.pdf', cache: true })
  const requestData = route.params.requestData;


  useEffect(() => {
    getToken();
  }, []);

  const renderDate = date => {
    return <Text style={styles.time}>{date}</Text>;
  };

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

  const getTokenNew = async () => {
    let resultdata = await AsyncStorage.getItem('userInfo');
    setUserInfo(resultdata);
    let jsondata = JSON.parse(resultdata);
    let token = await AsyncStorage.getItem('userToken');
    SetToken(token)
    Setjsondata(jsondata)
  }

  const historyDownload = () => {
    //Function to check the platform
    //If iOS the start downloading
    //If Android then ask for runtime permission
    if (Platform.OS === 'ios') {
      this.downloadHistory();
    } else {
      try {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'storage title',
            message: 'storage_permission',
          },
        ).then(granted => {
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //Once user grant the permission start downloading
            console.log('Storage Permission Granted.');
            downloadHistory();
          } else {
            //If permission denied then show alert 'Storage Permission 
            // Not Granted'
            Alert.alert('storage_permission');
          }
        });
      } catch (err) {
        //To handle permission related issue
        console.log('error', err);
      }
    }
  }


  const downloadHistory = async () => {
    const { config, fs } = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let date = new Date();
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        //Related to the Android only
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/Report_Download' +
          Math.floor(date.getTime() + date.getSeconds() / 2),
        description: 'Risk Report Download',
      },
    };
    config(options)
      .fetch('GET', url)
      .then((res) => {
        //Showing alert after successful downloading
        console.log('res -> ', JSON.stringify(res));
        alert('Report Downloaded Successfully.');
      });
  }

  const requestItem = () => {
    if (name_address == '') {
      ToastAndroid.show('write something first', ToastAndroid.SHORT);
      return;
    }
    setLoading(true)
    let variablesDAta = {
      title: name_address,
      itemRequestId: requestData.itemRequestID,
      userId: Number(jsondata.id),
      filePath: filePath,
      fileName: fileName
    }
    console.log('variablesDAta', variablesDAta);
    client
      .mutate({
        mutation: REQUEST_ITEM_POST_RESPONSE,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
            // 'Content-Length': 0,
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
        console.log('requestData>>>', result)
        if (result.data.postMstItemResponse.success) {
          setname_address('')
          setmsgDataNew([])
          // setTimeout(function () {              
          //    getRequestData();
          // }, 1000);
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
              // console.log(i)
              msgDataNew.push(msgData[i])
            }
          }
          msgDataNew.push(tdata)
          // navigation.navigate('Marsh26');

          setmsgData(msgDataNew)
          // console.log('msgDataNew', msgDataNew)
          // console.log('msgDataNew length', msgData.length)
          // console.log('msgDataNew mhhhh length', msgData)
          // Alert.alert('Success', result.data.postMstItemResponse.message)
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
    console.log('item......', item)
  }


  const getRequestItemNext = () => {

    let id = requestData.itemRequestID
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
        console.log('GET_RESPONSE_ITEMS>>>>>!!!!!!!!!!!!!', result.data.getResponseItems)
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

  const getRequestData = () => {
    // console.log('variablesDAta', variablesDAta);

    client
      .query({
        query: GET_RESPONSE_ITEMS_NEW,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
            // 'Content-Length': 0,
          },
        },
        variables: {
          id: idTo,
        },
      })
      .then(async result => {
        // console.log('9999999999999', result.data.getResponseItems)
        // setmsgData(result.data.getResponseItems); 
        if (result.data.getResponseItems) {
          setmsgData(result.data.getResponseItems);
          // [...msgData, result.data.getResponseItems]
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

      console.log('res : ' + JSON.stringify(res));
      setFilePath(res.uri)
      setFileName(res.name)
    } catch (err) {
      // setSingleFile(null);
      if (DocumentPicker.isCancel(err)) {
        alert('Canceled');
      } else {
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  // const { modalVisible } = this.state;
  return (

    <>

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
              {/* <Image style={{marginTop:10}} source={require('../assets/congratulation10.png')} /> */}
              <Text style={{ marginTop: 20, fontSize: 15 }}>
                Would you like to accept the offer
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonClo]}
                  // onPress={() => this.setModalVisible(!modalVisible)}
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

        {/* <View
          style={{
            backgroundColor: '#E84B4B',
            height: 30,
            width: 80,
            alignSelf: 'center',
            marginTop: 20,
            borderRadius: 5,
          }}> */}
        {/* <Text style={{color: '#FFFFFF', alignSelf: 'center', marginTop: 5}}>
            13/05/20
          </Text> */}
        {/* </View> */}
        {/* <View style={styles.container}>
          <Pdf
            source={{uri:'content://com.android.providers.downloads.documents/document/7973',cache:true}}
            onLoadComplete={(numberOfPages, filePath) => {
              console.log(`number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page, numberOfPages) => {
              console.log(`current page: ${page}`);
            }}
            onError={(error) => {
              console.log(error);
            }}
            onPressLink={(uri) => {
              console.log(`Link presse: ${uri}`)
            }}
            style={styles.pdf} />
        </View> */}
        <FlatList
          style={styles.list}
          data={msgData}
          keyExtractor={item => {
            return item.id;
          }}
          renderItem={comment => {
            // console.log(this.state.msgData);
            const item = comment.item;
            let inMessage = '';
            let itemStyle = inMessage ? styles.itemIn : styles.itemOut;
            return (
              <View>
                <View style={styles.itemOut}>
                  {/* {!inMessage && this.renderDate(item.date)} */}
                  <View style={styles.balloon}>
                    <Text>{item.comment}</Text>
                    {/* <Text>{item.mapItemResponseUpload[0].uploadPath}</Text> */}
                  </View>
                  {/* {inMessage && this.renderDate(item.date)} */}
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

        {/* <TouchableOpacity onPress={() => {
          historyDownload();
        }}>
          <Text
            style={{
            }}>
            Download Data
          </Text>
        </TouchableOpacity> */}
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
    </>
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
    // backgroundColor: '#eeeeee',
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
    // borderBottomColor: '#FFFFFF',
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
    // padding:2,
    margin: 5,
    borderRadius: 15
  },
  itemOutNew: {
    flexDirection: 'row',
    // justifyContent:'flex-end',
    backgroundColor: 'white',
    elevation: 5,
    padding: 12,
    // width:'40%',
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
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    //   padding: 95,
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
    // padding: 10,
    // elevation: 2
    height: 30,
    width: 120,
    marginTop: 40,
    borderWidth: 1,
    borderColor: '#9F1D20',
  },
  butt: {
    borderRadius: 10,
    // padding: 10,
    // elevation: 2
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
    // fontWeight: "bold",
    // textAlign: "center",
    fontSize: 15,
    alignSelf: 'center',
    marginTop: 4,
    marginLeft: 10,
  },
  textSty: {
    color: '#FFFFFF',
    // fontWeight: "bold",
    // textAlign: "center",
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