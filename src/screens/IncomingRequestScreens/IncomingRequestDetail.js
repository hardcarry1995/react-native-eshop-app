import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { imagePrefix } from '../../constants/utils';
import Moment from 'moment';
import { GET_INCOMING_HIERARCHY_RESPONSE_ITEMS, GET_HIERARCHY_RESPONSE_ITEMS, GET_INCOMING_TOP_LEVEL_RESPONSE_ITEMS } from '../../constants/queries';
import AsyncStorage from '@react-native-community/async-storage';
// import client from '../../constants/client';
import fileExtention from "file-extension";
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";
import { SliderBox } from "react-native-image-slider-box";
import FontawesomeIcon from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";
import { ApolloClient, InMemoryCache } from '@apollo/client';
import url from '../../constants/api';

const client = new ApolloClient({
  uri: url,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
  onError: ({ networkError, graphQLErrors }) => {
    console.log('graphQLErrors', graphQLErrors);
    console.log('networkError', networkError);
  },
});

const IncomingRequestDetail = ({ navigation, route, userState }) => {
  const data = route.params.data;
  const dateDMY = Moment(data.itemRequestDate).format('DD-MMM-YYYY');
  const [vehicleData, setVehicleData] = useState([]);
  const [name_address, setname_address] = useState('');
  const [images, setImages ] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const files = data.mapItemRequestUploadDto;
    if(files){
      const imageFiles = [];
      const documentFiles = [];
      files.forEach(file => {
        const extOfFile = fileExtention(file.uploadPath);
        if(extOfFile == 'jpg' || extOfFile == 'jpeg' || extOfFile == 'png' || extOfFile == 'gif'){
          const fullUrl = `${imagePrefix}${file.uploadPath}`
          imageFiles.push(fullUrl);
        } else if (extOfFile == 'doc' || extOfFile == 'docx' || extOfFile == 'pdf' || extOfFile == 'xls' || extOfFile == 'xlsx') {
          documentFiles.push({ ...file, ext: extOfFile });
        }
      });
      setImages(imageFiles);
      setDocuments(documentFiles);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getRequestItem();
    });
    return unsubscribe;
  }, [])
  
  const getRequestItem = async () => {
    let IsLogin = await AsyncStorage.getItem('IsLogin');
    if (IsLogin !== 'true') {
      navigation.navigate('AuthStack');
    } else {
      setLoading(true)
      let token = await AsyncStorage.getItem('userToken');
      let id = data.itemRequestID
      client
        .query({
          query: GET_INCOMING_TOP_LEVEL_RESPONSE_ITEMS,
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          variables: {
            requestId: parseInt(id),
          },
        })
        .then(async result => {
          if (result.data.getIncommingTopLevelResponseItems) {
            const topLevelResponses = result.data.getIncommingTopLevelResponseItems;
            let companies = topLevelResponses.map(response => {
              return {
                company: response.company,
                msgs : [response]
              }
            });
            client
              .query({
                query: GET_HIERARCHY_RESPONSE_ITEMS,
                context: {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
                variables: {
                  requestId: parseInt(id),
                },
              })
              .then(async result => {
                setLoading(false);
                if (result.data.getHierarchyResponseItems) {
                  const msgs = [...result.data.getHierarchyResponseItems];
                  msgs.sort((a, b) => a.itemResponseId - b.itemResponseId);
                  msgs.forEach(msg => {
                    const replyToId = msg.replyToId;
                    if(replyToId == null ) return;
                    companies.forEach((company, index) => {
                      const containIndex = company.msgs.findIndex(m => m.itemResponseId == replyToId);
                      if(containIndex > -1){
                        companies[index].msgs.push(msg);
                      }
                    })
                  });
                  setVehicleData(companies);
                } 
              })
              .catch(err => {
              console.log(err);
              setVehicleData(companies);
              setLoading(false);
              });
          }
        })
        .catch(err => {
          console.log('REQUEST_ITEM_GET_RESPONSE Error', err);
          setLoading(false);
        });
    }
  };

  const onPressDownloadFile = file => {
    const fullUrl = `${imagePrefix}${file.uploadPath}`;
    const tempfilename = `temperary_${Date.now()}.${file.ext}`;
    const localFile = `${RNFS.DocumentDirectoryPath}/${tempfilename}`;
    const options = {
      fromUrl: fullUrl,
      toFile: localFile,
    };
    RNFS.downloadFile(options)
      .promise
      .then((res) => {
        FileViewer.open(localFile)
      })
      .then(() => {
        // success
        console.log("Success")
      })
      .catch((error) => {
        // error
        console.log(error);
      });
  }

  const _onPressChatItem = (chat) => {
    navigation.navigate('IncomingRequestChat' , { requestData: data, mainChat : chat.msgs } );
  }

  return (
    <SafeAreaView style={{ paddingTop: 10}}>
      <ScrollView>
        <View>
        {images.length === 0 ?<Image
            style={{ height: 190, width: 360, alignSelf: 'center' }}
            source={data.itemImagePath ? { uri: `${imagePrefix}${data.itemImagePath}` } : require('../../assets/NoImage.jpeg')}
          /> : <SliderBox  images={images} />}
        </View>
        <View style={styles.main}>
          <View>
            <Text style={{ color: '#9F1D20', fontSize: 21, padding: 15 }}>
              {data.itemRequestTitle}
            </Text>
            <Text style={{ color: '#232323', marginLeft: 15, fontSize: 15 }}>
              Request Date
            </Text>
            <Text style={{ marginLeft: 135, marginTop: -20, color: '#C9C9C9' }}>
              {dateDMY}
            </Text>
            <Text style={{ color: '#232323', marginLeft: 15, fontSize: 15, marginTop: 20 }}>
              Category Details
            </Text>
            <Text style={{ color: '#E22727', marginLeft: 15, fontSize: 15, opacity: 0.7}}>
              {data.itemCategory}
            </Text>
            <Text style={{ color: '#232323', marginLeft: 15, fontSize: 15, marginTop: 18 }}>
              Status Request
            </Text>
            <Text style={{ color: '#2CD826', marginLeft: 140, fontSize: 15, marginTop: -20, }}>
              {data.itemRequestStatus}
            </Text>
            <Text style={{ color: '#232323', marginLeft: 15, fontSize: 15, marginTop: 18 }}>
              Description
            </Text>
            <Text style={{ color: '#C9C9C9', marginLeft: 15, fontSize: 15, marginTop: -2 }}>
              {data.itemRequestDescription}
            </Text>
            {data.suburb !== null &&
              <View>
                <Text style={{ color: '#232323', marginLeft: 15, fontSize: 15, marginTop: 18 }}>
                  Suburb
                </Text>
                <Text style={{ color: '#C9C9C9', marginLeft: 140, fontSize: 15, marginTop: -20 }}>
                  {data.suburb}
                </Text>
              </View>
            }
            {data.suburb === null &&
              <View>
                <Text style={{ color: '#232323', marginLeft: 15, fontSize: 15, marginTop: 18, }}>
                  Suburb
                </Text>
                <Text style={{ color: '#C9C9C9', marginLeft: 140, fontSize: 15, marginTop: -20, }}>
                  Not Provide
                </Text>
              </View>
            }
          </View>
          <View style={{ paddingVertical: 10}}>
            <Text style={{marginLeft : 15, fontSize: 15 }}>Documents:</Text>
            <View style={{ flexDirection: 'row', paddingHorizontal: 5, marginTop : 10}}>
              {documents.map((file) => {
                if(file.ext == 'pdf') {
                  return (
                  <TouchableOpacity style={{ marginLeft : 10}} onPress={() => onPressDownloadFile(file)}>
                    <FontawesomeIcon name="file-pdf-o" color="red" size={36} />
                  </TouchableOpacity> )
                }
                if(file.ext == "doc" || file.ext == 'docx'){
                  return (
                    <TouchableOpacity style={{ marginLeft : 10}} onPress={() => onPressDownloadFile(file)}>
                      <FontawesomeIcon name="file-word-o" color="blue" size={36}  />
                    </TouchableOpacity>
                  )
                }
                if(file.ext == 'xls' || file.ext === 'xlsx'){
                  return (
                  <TouchableOpacity style={{ marginLeft : 10}} onPress={() => onPressDownloadFile(file)}>
                    <FontawesomeIcon name="file-excel-o" color="green" size={36} />
                  </TouchableOpacity>)
                }
              })}
            </View>
          </View>
        </View>

        <View style={styles.main2}>
          <View>
            <Text style={{ color: '#9F1D20', fontSize: 21, padding: 15 }}>
              Selected Company
            </Text>

            {data.selectedCompany === null &&
              <Text style={{ color: '#232323', fontSize: 16, padding: 15, marginTop: -20 }}>
                No Selected Company
              </Text>
            }
            {data.selectedCompany !== null &&
              <Text style={{ color: '#232323', fontSize: 16, padding: 15, marginTop: -20, }}>
                {data.selectedCompany}
              </Text>
            }
          </View>
        </View>

        { loading && <ActivityIndicator  />}

        {!loading && <View style={{ marginBottom: 40 }}>
          <View style={styles.main3}>
            <Text style={{ color: '#9F1D20', fontSize: 21, padding: 15 }}>
              Responses({vehicleData == '' || vehicleData == undefined ? '0' : '1'})
            </Text>
            {vehicleData.length == 0 &&
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
                      navigation.navigate('IncomingRequestChat' , { requestData: data, mainChat: { msgs: []} });
                    }}>
                    <Image
                      source={require('../../assets/M26_3.png')}
                      style={styles.iconSend}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            }
           {vehicleData.length > 0 &&
            <View style={{ paddingHorizontal: 20}}>
              {vehicleData.map(chat => (
                <TouchableOpacity 
                  style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingBottom: 10,  borderBottomWidth: 1, borderBottomColor: '#cecece'}}
                  onPress={() => _onPressChatItem(chat)}
                >
                  <View>
                    <Text style={{ color: '#232323', fontSize: 17 }}>
                      {chat.company?.companyName}
                    </Text>
                    <Text style={{ color: '#232323', fontSize: 15, opacity: 0.7, marginTop: 5 }}>
                      {chat.msgs[chat.msgs.length - 1].comment}
                    </Text>
                  </View>
                  <Image 
                    style={{ height: 20, width: 20, alignSelf: 'flex-end', marginRight: 10 }}
                    source={require('../../assets/R25_2.png')}
                    resizeMode="contain"
                  />
              </TouchableOpacity>
              ))}
            </View>
            }
          </View>
        </View>}
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
    backgroundColor: 'white',
    borderRadius: 15,
    shadowRadius: 20,
    elevation: 8,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 20,
  },
  main3: {
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
  },
});

const mapStateToProps = (state) => ({
  userState : state
})

export default connect(mapStateToProps, null)(IncomingRequestDetail);
