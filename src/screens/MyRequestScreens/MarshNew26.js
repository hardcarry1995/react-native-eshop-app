import React, { useEffect, useState, useRef } from 'react';
import { Keyboard, StyleSheet, Text, View, TouchableOpacity, Image, Alert, Dimensions, TextInput, FlatList, Modal, ToastAndroid, ActivityIndicator } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { REQUEST_ITEM_POST_RESPONSE, UPDATE_REQUEST_ITEM_RESPONSE, GET_HIERARCHY_RESPONSE_ITEMS } from '../../constants/queries';
import AsyncStorage from '@react-native-community/async-storage';
import client from '../../constants/client';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from "react-redux";
import IonIcon from "react-native-vector-icons/Ionicons";
import moment from "moment";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';


const Marsh26 = ({ navigation, route, userState }) => {
  const [msgData, setmsgData] = useState(route.params.mainChat);
  const [name_address, setname_address] = useState('');
  const [modalVisible, setmodalVisibler] = useState(false);
  const [token, SetToken] = useState(userState.user.token);
  const [resultdata, setUserInfo] = useState([]);
  const [jsondata, Setjsondata] = useState('');
  const [requestId, setIdData] = useState(route.params.requestData.itemRequestID);
  const [replyToId, setReplyToId] = useState(route.params.mainChat[route.params.mainChat.length - 1].itemResponseId);
  const [loading, setLoading] = useState(false);
  const [filePath, setFilePath] = useState('')
  const [fileName, setFileName] = useState(null);
  const [isLoaded, setLoaded] = useState(false);
  const [didShowKeyboard, setDidShowKeyboard] = useState(false);
  const [contentMargin, setContentMargin] = useState(0);

  const flatlistRef = useRef(0);
  const scrollViewRef= useRef(0);

  useEffect(() => {
    if(!isLoaded){
      getToken();
    }
  }, []);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", (e) => {
      if(flatlistRef.current){
        flatlistRef.current.scrollToEnd();
      }
      setDidShowKeyboard(true);
      setContentMargin(e.endCoordinates.height);
    });

    const hideSubscription = Keyboard.addListener("keyboardWillHide", () => {
      setDidShowKeyboard(false);
      setContentMargin(0);
    })

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    msgData.map(msg => {
      let inMessage = msg.companyId;
      if(inMessage && msg.statusId != 2 ){
        client
          .mutate({
            mutation: UPDATE_REQUEST_ITEM_RESPONSE,
            context: {
              headers: {
                Authorization: `Bearer ${token}`
              },
            },
            variables: {
              comment: msg.comment,
              companyId: msg.companyId,
              createdBy: msg.createdBy,
              createdDate: msg.createdDate,
              isAccepted: true,
              isActive: msg.isActive,
              isRejected: msg.isRejected,
              itemRequestId: msg.itemRequestId,
              itemResponseId: msg.itemResponseId,
              modifiedBy: msg.modifiedBy,
              modifiedDate: msg.modifiedDate,
              replyToId: msg.replyToId,
              responseDate: msg.responseDate,
              userId: msg.userId 
            }
          })
          .catch(error => { 
            console.log(error);
          })
      }

    });
  }, []) 

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
    // getRequestItemNext();
    setLoaded(true)
  }

  const requestItem = () => {
    if (name_address == '') {
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
          itemRequestId: route.params.requestData.itemRequestID,
          userId: Number(jsondata.id),
          filePath: filePath,
          fileName: fileName,
          replyToId: replyToId
        },
      })
      .then(async result => {
          setname_address('')
          const { comment, companyId, createdDate, isAccepted, isActive, isRejected, itemRequestId, itemResponseId, mapItemResponseUpload, responseDate, userId  } = result.data.postMstItemResponse;
          let tdata = {
            comment: comment,
            companyId: parseInt(companyId),
            createdBy: null,
            createdDate: createdDate,
            isAccepted: isAccepted,
            isActive: isActive,
            isRejected: isRejected,
            itemRequestId: itemRequestId,
            itemResponseId: itemResponseId,
            mapItemResponseUpload: mapItemResponseUpload,
            modifiedBy: null,
            modifiedDate: null,
            replyToId: null,
            statusId: 1,
            responseDate: responseDate,
            userId: userId
          };
          setmsgData((prevState) => [...prevState, tdata] )
          setLoading(false);
          setReplyToId(itemResponseId);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const showPDFOnClick = (item) => {
    navigation.navigate('ShowPDF', { pdfPath: item });
  }

  const getRequestItemNext = () => {
    client
      .query({
        query: GET_HIERARCHY_RESPONSE_ITEMS,
        context: {
          headers: {
            Authorization: `Bearer ${userState.user.token}`,
          },
        },
        variables: {
          requestId: parseInt(requestId),
          replyToId: parseInt(replyToId)
        },
      })
      .then(async result => {
        if (result.data.getHierarchyResponseItems) {
          setmsgData(prev => [...prev, ...result.data.getHierarchyResponseItems]);
        } else {

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
        // alert('Canceled');
      } else {
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  const chooseImage = async () => {
    const result = await launchImageLibrary({selectionLimit : 1}, null);
    if(result.didCancel){
      return ;
    }
    const image = result.assets[0];
    setFilePath(image.uri)
    setFileName(image.fileName)
  }

  return (
    <View style={{ flex : 1,  marginBottom : contentMargin }}>
      <View style={styles.container}>
        <FlatList
          style={styles.list}
          ref={flatlistRef}
          data={msgData}
          keyExtractor={item => { return item.index; }}
          renderItem={comment => {
            const item = comment.item;
            let inMessage = item.companyId;
            let itemStyle = inMessage ? styles.itemIn : styles.itemOut;
            return (
              <View key={comment.index}>
                <View style={itemStyle}>
                  <View style={styles.balloon}>
                    <Text>{item.comment}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 10, paddingBottom : 5, alignItems: 'center', }}>
                    <Text style={{fontSize: 12, color: "#666", marginTop: 2}}>{moment(item.createdDate).format("HH:mm")}</Text>
                    {(item.statusId == 1 && !inMessage) && <IonIcon name="checkmark" color="#0AA1DD" /> }
                    {(item.statusId == 2 && !inMessage) && <IonIcon name="checkmark-done" color="#0AA1DD" /> }
                  </View>
                </View>
                {item.mapItemResponseUpload[0]?.documentName && (
                  <View style={{ alignSelf: 'flex-end' }}>
                    <TouchableOpacity onPress={() => showPDFOnClick(item.mapItemResponseUpload[0].uploadPath)}>
                      <View style={styles.itemOutNew}>
                        <View>
                          <Image
                            source={require('../../assets/PDFSHOW.png')}
                            style={{ width: 20, height: 20, marginRight: 5, marginTop: 0, resizeMode: 'contain' }}
                            resizeMode="contain"
                          />
                        </View>
                        <View >
                          <Text>{item.mapItemResponseUpload[0]?.documentName}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          }}
          onContentSizeChange={() => flatlistRef.current.scrollToEnd({ animated: true })}
          onLayout={() => flatlistRef.current.scrollToEnd({ animated: true })}
        />

        <View style={styles.footer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputs}
              placeholder="Write a message..."
              underlineColorAndroid="transparent"
              value={name_address}
              onChangeText={name_address => setname_address(name_address)}
              multiline
            />
            <TouchableOpacity onPress={() => selectFileDoc()}>
              <Image
                style={{ height: 24, width: 17, marginRight: 10 }}
                source={require('../../assets/M26_1.png')}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Image
                style={{ height: 22, width: 15, marginRight: 19 }}
                source={require('../../assets/M26_2.png')}
                resizeMode="contain"
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
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>
        </View>
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
              <View style={{ alignItems: 'flex-end', width: '100%', paddingRight : 20, marginTop: 10}}>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Image
                    style={{ height: 15, width: 15, marginLeft: 10, tintColor: "#000" }}
                    source={require('../../assets/cros.png')} 
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              <Text style={{ marginTop: 20, fontSize: 15 }}>
                Would you like to accept the offer
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonClose, { flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}]}
                  onPress={() => setModalVisible(false)}>
                  <Image
                    style={{ height: 15, width: 15, marginRight: 10, tintColor: "#fff" }}
                    source={require('../../assets/noun_Check.png')}
                    resizeMode="contain"
                  />
                  <Text style={{ fontWeight: '600', color: "#fff"}}>Purchase</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.butt, styles.buttonClose, { flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}]}
                  onPress={() => navigation.goBack()}>
                  <Image
                    style={{ height: 12, width: 12, marginRight: 10, tintColor: '#fff' }}
                    source={require('../../assets/cros.png')}
                    resizeMode="contain"
                  />
                  <Text style={{ fontWeight: '600', color: "#fff" }}>Decline</Text>

                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
    marginBottom: 65
  },
  footer: {
    flexDirection: 'row',
    height: 60,
    paddingHorizontal: 10,
    padding: 5,
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#eee"
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
    paddingTop: 10
  },
  balloon: {
    maxWidth: 250,
    paddingHorizontal : 15,
    paddingTop: 15,
    borderRadius: 20,
  },
  itemIn: {
    alignSelf: 'flex-start',
    backgroundColor: 'lightgrey',
    elevation: 4,
    margin: 5,
    borderRadius: 15
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

const mapStateToProps = (state) => ({
  userState: state
})

export default connect(mapStateToProps, null)(Marsh26);