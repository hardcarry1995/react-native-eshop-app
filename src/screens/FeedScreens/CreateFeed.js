import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, ToastAndroid, Modal } from 'react-native';
import { connect } from 'react-redux';
import { REQUEST_ITEM, SAVE_VEHICLE, GET_ALL_VEHICLE_DETAIL } from '../../constants/queries';
import AsyncStorage from '@react-native-community/async-storage';
import client from '../../constants/client';
import { gql } from '@apollo/client';
import QRCodeScanner from 'react-native-qrcode-scanner';
import DocumentPicker from 'react-native-document-picker';
import DatePicker from 'react-native-datepicker';
import { Alert } from 'react-native';
import { ActivityIndicator, RadioButton } from 'react-native-paper';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import url from '../../constants/api';
import RBSheet from "react-native-raw-bottom-sheet";
import { imagePrefix } from '../../constants/utils';
import moment from 'moment';

export const REQUEST_ITEMS = gql
{
  query: `mutation MstItemRequest(
    $userId: Int
    $title: String
    $desc: String
    $catId: Int
    $date:DateTime
    $suburbId: Int
    $files: Upload
  ) {
    postMstItemRequest(mstItemRequest:{
        itemRequestTitle: $title
        itemRequestDescription: $desc
        itemRequestDate: $date
        categoryId: $catId
        suburbId: $suburbId
        requestApprovedMail: false
        createdBy: $userId
        createdDate: $date
        modifiedDate: $date
      },
      files:$files
    ) {
      count
      currentPage
      message
      nextPage
      prevPage
      success
      totalPages
      result
    }
  }
`
  variables: {
    file: File // a.txt
  }
};

const Request = (props) => {
  const { navigation, route } = props;
  const format3 = "DD-MM-YYYY";
  let DataObject = {};
  if (Object.keys(route.params.refered_data ?? {}).length > 0) {
    DataObject = route.params.refered_data ?? {};
    props.setRefered_by('');
  }
  const { 
    'title': R_title = route.params.title, 
    categoryId = route.params.categoryId, 
    subCategoryId = route.params.subCategoryId, 
    'desc': R_desc = route.params.desc, 
    'startdate': R_startdate = route.params.startdate, 
    'setcatId': R_setcatId = '', 
    'pushsetcatId': R_pushsetcatId = '', 
    'setPDF': R_setPDF = [], 
    'setImagesUpload': R_setImagesUpload = [], 
    'subCategoryName': R_subCategoryName = route.params.subCategoryName, 
    mapSpecialUpload = route.params.mapSpecialUpload 
  } = DataObject;
  const [title, setTitle] = useState(R_title);
  const [desc, setDesc] = useState(R_desc);
  const [scan, setScan] = useState(false);
  const [result, setResult] = useState();
  const [todayDate, settodayDate] = useState('');
  const [startdate, setStartdate] = useState(R_startdate || moment(new Date()).format(format3));
  const [setcatId, setcategryId] = useState(R_setcatId);
  const [pushsetcatId, pushsetcategryId] = useState(R_pushsetcatId);
  const [ndate, setNDate] = useState(new Date());
  const [mode, setMode] = useState('time');
  const [show, setShow] = useState(false);
  const [vehicleData, setVehicleData] = useState([]);
  const [setPDF, setAllPDF] = useState(R_setPDF);
  const [ntime, setNTime] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState('');
  const [num, setNum] = useState('');
  const [filePath, setFilePath] = useState([]);
  const [setImagesUpload, setImagesUploadData] = useState(R_setImagesUpload);
  const [vehicleClick, getVehicleClick] = useState('no');
  const [AllVehicleStore, setAllVehicleStore] = useState([]);
  const [checked, setChecked] = React.useState('');
  const subCategoryName = R_subCategoryName;
  const refRBSheet = useRef();
  const [addRequestItem, setAddRequestItem] = useState(false);
  const [mapSpecialUploads, setMapSpecialUploads] = useState(mapSpecialUpload);
  const acceptedImageArray = ["image/gif", "image/jpg", "image/jpeg", "image/png"];

  useEffect(() => {
    ShowCurrentDate();
  });


  const removeImage = (e) => {
    var array = [...setImagesUpload]; // make a separate copy of the array
    var index = array.indexOf(e)
    if (index !== -1) {
      array.splice(index, 1);
      setImagesUploadData(array);
    }
  }

  const removePreLoadedImage = (e) => {
    var array = [...mapSpecialUploads]; // make a separate copy of the array
    var index = array.indexOf(e)
    if (index !== -1) {
      array.splice(index, 1);
      setMapSpecialUploads(array);
    }
  }

  const ShowCurrentDate = () => {
    setcategryId(categoryId)
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    const todayDatet = date + '-' + month + '-' + year;
    settodayDate(todayDatet);

  }
  const onChange = (selectedDate) => {
    // setShow(Platform.OS === 'ios');
    if (selectedDate) {
      const selectedTime = selectedDate || ntime;
      setNTime(selectedTime);
    }
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const onSuccess = (e) => {
    setResult(e.data)
    setScan(false)
    let string = e.data
    const words = string.split('%');
    setVehicleData(words);
    saveVehicleDetail()
  }
  const removePeople = (e) => {
    var array = [...setPDF]; // make a separate copy of the array
    var index = array.indexOf(e)
    if (index !== -1) {
      array.splice(index, 1);
      setAllPDF(array);
    }
  }

  const startScan = () => {
    setScan(true)
    setResult()
  }


  const requestItem = async () => {
    let IsLogin = await AsyncStorage.getItem('IsLogin');
    if (IsLogin !== 'true') {
      const referData = { 'name': 'CreateFeed', 'data': { 'title': title, 'desc': desc, 'startdate': startdate, 'categoryId': categoryId, 'subCategoryId': subCategoryId, 'setcatId': setcatId, 'pushsetcatId': pushsetcatId, 'setPDF': setPDF, 'setImagesUpload': setImagesUpload, 'subCategoryName': subCategoryName } };
      props.setRefered_by(JSON.stringify(referData));
      navigation.navigate('AuthStack');
    } else {
      let resultdata = await AsyncStorage.getItem('userInfo');
      let jsondata = JSON.parse(resultdata);
      let token = await AsyncStorage.getItem('userToken');
      var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/\r\n/g, "\n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } }

      const fruitsj = filePath;
      const datacheckj = JSON.stringify(fruitsj)
      const allValueOfData = datacheckj.replace(',', '');
      const gatjej = allValueOfData.replace(']', '');
      const allDataGetAtTime = gatjej.replace('[', '');
      const allFiles = [...setImagesUpload, ...setPDF];
      const allFilesData = [];
      allFiles.map((data) => {
        const file = {
          uri: data.uri,
          name: data.name ?? data.fileName,
          type: data.type,
        };
        allFilesData.push(file);
      });
      if (title === '') {
        ToastAndroid.show('Please enter title', ToastAndroid.SHORT);
      } else if (desc === '') {
        ToastAndroid.show('Please enter description', ToastAndroid.SHORT);
      } else if (categoryId === '' || categoryId === undefined || categoryId === null) {
        ToastAndroid.show('Category not selected', ToastAndroid.SHORT);
      } else if (subCategoryId === '' || subCategoryId === undefined || subCategoryId === null) {
        ToastAndroid.show('Subcategory not selected', ToastAndroid.SHORT);
      } else {
        setAddRequestItem(true);
        if (allFilesData.length < 1) {
          let variablesDAta = {
            title: title,
            desc: desc,
            suburbId: subCategoryId,
            date: new Date().toISOString(),
            catId: categoryId,
            userId: Number(jsondata.id),
            files: [...allFilesData]
          }
          client
            .mutate({
              mutation: REQUEST_ITEM,
              context: {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
              variables: variablesDAta,
            })
            .then(result => {
              console.log('result>>>', result)
              if (result.data.postMstItemRequest.success) {
                Alert.alert('Success', result.data.postMstItemRequest.message)
                navigation.navigate('Request24');
              } else {
                Alert.alert('Failed', result.data.postMstItemRequest.message)
              }
            })
            .catch(err => {
              console.log('!!!!!!!!!!!!!!!!', err);
            });
          setAddRequestItem(false);
        } else {
          try {
            var data = new FormData();
            var newDate = new Date().toISOString();
            let variablesDataObject = {};
            let nullFilesArray = '';
            if (allFilesData.length > 1) {
              allFilesData.forEach((element, index) => {
                nullFilesArray = index == 0 ? null : nullFilesArray + ',' + null;
                variablesDataObject[index] = ['variables.files.' + index];
                data.append(index, element);
              });
              data.append('map', JSON.stringify(variablesDataObject));
            }
            else if (allFilesData.length == 1) {
              nullFilesArray = null;
              data.append('map', '{"0": ["variables.files"]}');
              data.append('0', allFilesData[0]);
            } else {
            }

            const query = `mutation refactored480(
                                $files: [Upload!]
                                $mstItemRequest443: MstItemRequestInputType!
                              ) {
                                postMstItemRequest(mstItemRequest: $mstItemRequest443, files: $files) {
                                count
                                currentPage
                                message
                                nextPage
                                prevPage
                                success
                                totalPages
                                result
                                }
                              }`;

            const operation = {
              query,
              variables: {
                "mstItemRequest443": { "itemRequestTitle": title, "itemRequestDescription": desc, "itemRequestDate": newDate, "categoryId": categoryId, "suburbId": subCategoryId, "requestApprovedMail": false, "createdBy": Number(jsondata.id), "createdDate": newDate, "modifiedDate": newDate },
                files: 'NULL_ARRAY_TO_REPLACE_FOR_MULTIPLE_FILES',
              },
              'operationName': 'refactored480'
            };
            data.append('operations', JSON.stringify(operation).replace(/\"NULL_ARRAY_TO_REPLACE_FOR_MULTIPLE_FILES\"/g, '[' + nullFilesArray + ']'));

            const response = await fetch(url, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
              },
              body: data
            });
            const result = await response.json();
            if (result?.data?.postMstItemRequest?.success) {
              Alert.alert('Success', result?.data?.postMstItemRequest?.message)
              navigation.navigate('Request24');
            } else {
              Alert.alert('Failed', result?.data?.postMstItemRequest?.message)
            }
          } catch (error) {
            console.log(error);
          } finally {
            setAddRequestItem(false);
          }
        }
      }
    }
  };
  const changeTheDescription = (value) => {
    const words = value
    let dataofvehicle = 'Engine Number - ' + words.engineNumber + '\nVehicle Reg Number - ' + words.registrationNumber + '\nMake -  ' + words.make + '\nVIN - ' + words.vIN + '\nDescription - ' + words.description + '\nDate Of expiry - ' + words.dateOfExpiry + ''
    setDesc(dataofvehicle)
  }
  const saveVehicleDetail = async () => {
    if (vehicleData[14] == undefined) {
      Alert.alert('Error', 'Scan again')
    } else {
      let IsLogin = await AsyncStorage.getItem('IsLogin');
      if (IsLogin !== 'true') {
        navigation.navigate('Auth');
      } else {
        let resultdata = await AsyncStorage.getItem('userInfo');
        let jsondata = JSON.parse(resultdata);
        let token = await AsyncStorage.getItem('userToken');

        let variablesDAta = {
          registrationNumber: vehicleData[7],
          desc: vehicleData[8],
          engineNumber: vehicleData[13],
          date: ndate,
          dateOfExpiry: vehicleData[14],
          vin: vehicleData[12],
          make: vehicleData[9],
          vehicleID: Number(vehicleData[2]),
          userId: Number(jsondata.id),
        }
        console.log('variablesDAta >>>>>>', variablesDAta);

        client
          .mutate({
            mutation: SAVE_VEHICLE,
            context: {
              headers: {
                Authorization: `Bearer ${token}`
              },
            },
            variables: {
              registrationNumber: vehicleData[7],
              desc: vehicleData[8],
              engineNumber: vehicleData[13],
              date: ndate,
              dateOfExpiry: vehicleData[14] + "T18:30:00.000",
              vin: vehicleData[12],
              make: vehicleData[9],
              vehicleID: Number(vehicleData[2]),
              userId: Number(jsondata.id),
            },
          })
          .then(result => {
            if (result.data.postVehicle.success) {
              Alert.alert('Success', result.data.postVehicle.message)
              const words = vehicleData;
              let dataofvehicle = 'Engine Number - ' + words[13] + '\nVehicle Reg Number - ' + words[7] + '\nMake -  ' + words[9] + '\nVIN - ' + words[12] + '\nDescription - ' + words[8] + '\nDate Of expiry - ' + words[14] + ''
              setDesc(dataofvehicle)
            } else {
              Alert.alert('Error', result.data.postVehicle.message)
            }
          })
          .catch(err => {
            console.log('!!!!!!!!!!!!!!!!', err);
          });
      }
    }
  };

  const chooseImage = async () => {
    const result = await launchImageLibrary({selectionLimit : 0}, null);
    if(result.didCancel){
      return ;
    }
    const images = result.assets;
    console.log(images);
    setImagesUploadData(prevState => [...prevState, ...images]) ;
  }

  const chooseFile = async value => {
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.images],
      });
      const checkifnotexist = results.some(function (e) {
        return !acceptedImageArray.includes(e.type);
      });

      if (checkifnotexist) {
        ToastAndroid.show('Please select only jpg, jpeg, png and gif files', ToastAndroid.LONG);
      }
      else {
        const allImageDoc = [...setImagesUpload, ...results];
        setImagesUploadData(allImageDoc);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log("Cancelled");
      } else {
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  const getMyVehicles = async () => {
    let IsLogin = await AsyncStorage.getItem('IsLogin');
    if (IsLogin !== 'true') {
      navigation.navigate('Auth');
    } else {
      let token = await AsyncStorage.getItem('userToken');
      client
        .query({
          query: GET_ALL_VEHICLE_DETAIL,
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        })
        .then(async result => {
          if (result.data.getVehicles.success) {
            console.log('result', result);
            if (result.data.getVehicles.result.length > 0) {
              RBSheet.current.open()
              getVehicleClick('yes')
              setAllVehicleStore(result.data.getVehicles.result)
            } else {
              Alert.alert('Alert', 'Firsltly scan the vehicle and store it')
            }
            // const words = result.data.getVehicles.result[0]
            // setChecked(words)
            // let dataofvehicle = 'Engine Number - ' + words.engineNumber + '\nVehicle Reg Number - ' + words.registrationNumber + '\nMake -  ' + words.make + '\nVIN - ' + words.vIN + '\nDescription - ' + words.description + '\nDate Of expiry - ' + words.dateOfExpiry + ''
            // setDesc(dataofvehicle)
          } else {
            ToastAndroid.show(
              result.data.getVehicles.message,
              ToastAndroid.SHORT,
            );
          }
        })
        .catch(err => {
          // this.setState({ loading: '' });
          console.log(err);
        });
    }
  }

  const chooselaunchCamera = () => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
    };
    launchCamera(options, res => {
      if (res.didCancel) {
        return;
      } else if (res.errorCode == 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (res.errorCode == 'permission') {
        alert('Permission not satisfied');
        return;
      } else if (res.errorCode == 'others') {
        alert(res.errorMessage);
        return;
      }
      if (num == 1) {
        setIddoc(JSON.stringify(res.assets[0].uri));
        setImage(res.assets[0].uri);
      }
      if (num == 2) {
        setWorkagree(JSON.stringify(res.assets[0].uri));
        setSecImage(res.assets[0].uri);
      }
      if (num == 3) {
        setOtherdoc(JSON.stringify(res.assets[0].uri));
        setThImage(res.assets[0].uri);
      }
      setModalVisible(false);
    });
  };

  const addDateOnDescription = (value) => {
    let dataofvehicle = desc + '\nAppointment Date  : ' + value
    setDesc(dataofvehicle)
  }
  const addTimeOnDescription = (value) => {
      let dataofvehicle = desc + '\nTime  : ' + startdate.toString() + ' T ' + value;
      setDesc(dataofvehicle)
  }

  const selectFileDoc = async value => {
    try {
      console.log([DocumentPicker.types.pdf, DocumentPicker.types.doc, DocumentPicker.types.xls, DocumentPicker.types.docx]);
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.doc, DocumentPicker.types.xls, DocumentPicker.types.docx],
      });
      const allFileDoc = [...setPDF, ...results];
      setAllPDF(allFileDoc);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {addRequestItem && 
      <View style={styles.addRequestItemView}>
        <ActivityIndicator size="small" color="#000" />
      </View>}
      <ScrollView style={{ flex: 1, padding: 15 }}>
        {!scan &&
          <View>
            <Text style={{ color: '#323232', fontSize: 18, fontWeight: '600' }}> Selected Category </Text>
            <Text style={{ color: '#323232', fontSize: 15, opacity: 0.5, marginVertical: 10}}>
              {`Category > Sub Category > ${subCategoryName}`}
            </Text>
            <Text style={{ color: '#323232', fontSize: 16, marginTop: 10 }}>Item Details </Text>
            <TextInput 
              style={{ borderColor: '#DEDEDE', borderWidth: 1, height: 40, borderRadius: 5, marginTop: 10, paddingHorizontal: 10}}
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              underlineColorAndroid="transparent"
            />
            <TextInput
              style={{ borderColor: '#DEDEDE', borderWidth: 1, borderRadius: 5, marginTop: 10, paddingHorizontal: 10, height: 120 }}
              placeholder="Description..."
              onChangeText={setDesc}
              numberOfLines={5}
              multiline
              value={desc}
              underlineColorAndroid="transparent"
            />
            <View style={{ height: 1, backgroundColor: '#E9E9E9', width: '100%', marginTop: 15,}} />

            <Text style={{ color: '#323232', fontSize: 18, marginTop: 10 }}>
              Schedule Appointment
            </Text>
            <View style={{ flexDirection: 'row', padding: 10 }}>
              <View style={{ height: 40, width: 150, alignItems: 'center', justifyContent: 'center' }}>
                <DatePicker
                  date={startdate}
                  mode="date"
                  format="DD-MM-YYYY"
                  minDate={todayDate}
                  maxDate="01-06-2050"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  theme="dark"
                  textColor="#333333"
                  customStyles={{
                    dateIcon: { position: 'absolute', left: 0, top: 4, height: 0, width: 0, marginLeft: 0 },
                  }}
                  onDateChange={value => {
                    addDateOnDescription(value)
                    setStartdate(value)
                  }}
                />
              </View>

              <View style={{ height: 40, width: 150, alignItems: 'center', justifyContent: 'center', marginLeft: 20 }}>
                <TouchableOpacity onPress={showTimepicker}>
                    <DatePicker
                      date={startdate}
                      mode="time"
                      format="HH:mm"
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      customStyles={{
                        dateIcon: { position: 'absolute', left: 0, top: 4, height: 0, width: 0, marginLeft: 0 },
                        dateInput: {
                        }
                      }}
                      onDateChange={value => {
                        console.log(value);
                        addTimeOnDescription(value)
                        onChange(value)
                      }}
                    />
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ margin: 10, height: 150 }}>
              <View>
                <ScrollView horizontal style={{ flexDirection: 'row', width: '100%' }}>
                  {mapSpecialUploads?.length > 0 && mapSpecialUploads?.map(e =>
                    <View>
                      <View>
                        <TouchableOpacity style={{ marginLeft: 23, marginTop: 10, height: 65, width: 65 }} onPress={() => removePreLoadedImage(e)}>
                          <Image 
                            style={{ height: 60, width: 60, resizeMode: 'center' }}
                            source={{ uri: `${imagePrefix}${e?.thumbNailPath}` }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                  {setImagesUpload.map(e =>
                    <View>
                      <View>
                        <TouchableOpacity style={{ marginLeft: 10, marginTop: 10, height: 65, width: 65 }} onPress={() => removeImage(e)}>
                          <Image
                            style={{ backgroundColor: 'gainsboro', height: 60, width: 60, resizeMode: 'center'}}
                            source={{ uri: e.uri }}
                            defaultSource={require('../../assets/image_placeholder1.png')}
                            resizeMode="contain"
                          />
                          <Image
                            style={{ height: 20, width: 20, position: 'absolute', top: 2, right: 0 }}
                            source={require('../../assets/remove.png')}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  <TouchableOpacity onPress={() => chooseImage()}>
                    <Image
                      style={{ height: 60, width: 60, resizeMode: 'center', marginLeft: 23, }}
                      source={require('../../assets/uploadimg.png')}
                      resizeMode="contain"
                    />
                    <Text style={{ color: '#DB3236', marginLeft: 4 }}>UPLOAD IMAGE</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
              <View>
                <ScrollView horizontal style={{ flexDirection: 'row', width: '100%' }}>
                  {setPDF.map(e =>
                    <View>
                      <View>
                        {(e.type == "application/pdf" || e.type == DocumentPicker.types.pdf) &&
                          <View>
                            <TouchableOpacity style={{ marginLeft: 10, marginTop: 10, height: 65, width: 65 }} onPress={() => removePeople(e)}>
                              <Image
                                style={{ height: 60, width: 60, resizeMode: 'center' }}
                                source={require('../../assets/pdf.png')}
                                resizeMode="contain"
                              />
                              <Image
                                style={{ height: 20, width: 20, position: 'absolute', top: 2, right: 0 }}
                                source={require('../../assets/remove.png')}
                                resizeMode="contain"
                              />
                            </TouchableOpacity>
                          </View>
                        }
                      </View>
                      <View>
                        {(e.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || e.type == DocumentPicker.types.docx) &&
                          <View>
                            <TouchableOpacity style={{ marginLeft: 10, marginTop: 10, height: 65, width: 65 }} onPress={() => removePeople(e)}>
                              <Image
                                style={{ height: 60, width: 60, resizeMode: 'center' }}
                                source={require('../../assets/docx.png')}
                                resizeMode="contain"
                              />
                              <Image
                                style={{ height: 20, width: 20, position: 'absolute', top: 2, right: 0 }}
                                source={require('../../assets/remove.png')}
                                resizeMode="contain"
                              />
                            </TouchableOpacity>
                          </View>
                        }
                      </View>
                      <View>
                        {(e.type == "application/msword" || e.type == DocumentPicker.types.doc) &&
                          <View>
                            <TouchableOpacity style={{ marginLeft: 10, marginTop: 10, height: 65, width: 65 }} onPress={() => removePeople(e)}>
                              <Image style={{ height: 60, width: 60, resizeMode: 'center' }}
                                source={require('../../assets/doc.png')}
                                resizeMode="contain"
                              />
                              <Image
                                style={{ height: 20, width: 20, position: 'absolute', top: 2, right: 0 }}
                                resizeMode="contain"
                                source={require('../../assets/remove.png')}
                              />
                            </TouchableOpacity>
                          </View>
                        }
                      </View>
                      <View>
                        {(e.type == "application/vnd.ms-excel" || e.type == DocumentPicker.types.xls || e.type == DocumentPicker.types.xlsx || e.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") &&
                          <View>
                            <TouchableOpacity style={{ marginLeft: 10, marginTop: 10, height: 65, width: 65 }} onPress={() => removePeople(e)}>
                              <Image
                                style={{ height: 60, width: 60, resizeMode: 'center', }}
                                resizeMode="contain"
                                source={require('../../assets/xls.png')}
                              />
                              <Image
                                style={{ height: 20, width: 20, position: 'absolute', top: 2, right: 0 }}
                                resizeMode="contain"
                                source={require('../../assets/remove.png')}
                              />
                            </TouchableOpacity>
                          </View>
                        }
                      </View>
                      
                    </View>
                  )}
                  <TouchableOpacity onPress={() => selectFileDoc()}>
                    <Image
                      style={{ height: 60, width: 60, resizeMode: 'center', marginLeft: 23, marginTop: 10 }}
                      resizeMode="contain"
                      source={require('../../assets/Group12.png')}
                    />
                    <Text style={{ color: '#DB3236', marginLeft: 10 }}>UPLOAD FILE</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </View>
            <View style={{}}>
              <View style={{ padding: 8, flexDirection: 'row', alignContent: 'center' }}>
                {setcatId == 1336 &&
                  <TouchableOpacity onPress={startScan}
                    style={{ height: 35, width: '45%', borderRadius: 5, borderWidth: 1, borderColor: '#DE5246', marginHorizontal: 10 }}>
                    <Text style={{ color: '#DE5246', margin: 5, textAlign: 'center' }}>
                      SCAN LICENSE DISC
                    </Text>
                  </TouchableOpacity>
                }
                <TouchableOpacity
                  style={{ height: 35, width: '45%', backgroundColor: '#DE5246', borderRadius: 5, borderWidth: 1, borderColor: '#DE5246' }}
                  onPress={() => { requestItem(); }}>
                  <Text style={{ color: '#FAFAFA', margin: 5, marginLeft: 10, textAlign: 'center' }}>
                    SUBMIT REQUEST
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ padding: 8, flexDirection: 'row', alignContent: 'center' }}>
                {setcatId == 1336 &&
                  <TouchableOpacity
                    style={{
                      height: 35,
                      width: '45%',
                      backgroundColor: '#DE5246',
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: '#DE5246',
                      marginLeft: 10,
                      marginBottom: 100
                    }}
                    onPress={() => {
                      getMyVehicles();
                    }}>
                    <Text style={{ color: '#FAFAFA', margin: 5, marginLeft: 10, textAlign: 'center' }}>
                      MY VEHICLE
                    </Text>
                  </TouchableOpacity>
                }
              </View>
            </View>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginBottom: 100 }}>
              <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                openDuration={250}
                customStyles={{
                  container: {
                    justifyContent: "center",
                    alignItems: "center"
                  }
                }}
              >
                <RadioButton.Group onValueChange={value => {
                  refRBSheet.current.close()
                  changeTheDescription(value)
                  setChecked(value)
                }} value={checked} >
                  {AllVehicleStore.map((item, i) => {
                    return (
                      <RadioButton.Item label={item.make} value={item} />
                    )
                  })
                  }
                </RadioButton.Group>
              </RBSheet>
            </View>
          </View>
        }
        <View style={styles.scrollViewStyle}></View>
        <View style={styles.body}>
          {result &&
            <View style={styles.sectionContainer}>
              {/* <Text style={styles.centerText}>{result}</Text> */}
            </View>
          }
          {!scan &&
            <View style={styles.sectionContainer}>
            </View>
          }
          {scan &&
            <View style={styles.sectionContainer}>
              <QRCodeScanner
                reactivate={true}
                showMarker={true}
                ref={(node) => { this.scanner = node }}
                onRead={onSuccess}
                topContent={
                  <Text style={styles.centerText}>
                    Scan your QRCode!
                  </Text>
                }
              />
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity style={styles.stopbtn} onPress={() => this.scanner.reactivate()}>
                  <Text style={styles.buttonTextStyle}>OK. Got it!</Text>
                </TouchableOpacity>
                <View style={{ width: 20 }}></View>
                <TouchableOpacity style={styles.stopbtn} onPress={() => setScan(false)}>
                  <Text style={styles.buttonTextStyle}>Stop Scan</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const mapDispatchToProps = dispatch => ({
  setRefered_by: value => {
    dispatch({
      type: 'SET_REFERER',
      payload: value,
    });
  },
});

export default connect(null, mapDispatchToProps)(Request);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F6F6F8',
  },
  addRequestItemView: { 
    position: 'absolute', 
    top: 0, 
    left: 0,
    bottom: 0, 
    right: 0, 
    width: '100%', 
    height: '100%', 
    backgroundColor: '#0000001f', 
    alignItems: 'center', 
    justifyContent: 'center', 
    zIndex: 9 
  },
  dashedStyle: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    padding: 25,
  },
  dashedStyle1: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#E2E4E6',
    borderRadius: 50,
    justifyContent: 'center',
    width: '100%',
    height: 46,
  },
  buttonTextStyle: {
    color: '#FAFAFA', margin: 5, marginLeft: 10,
    textAlign: 'center'
  },
  stopbtn: {
    height: 35,
    width: '47%',
    backgroundColor: '#DE5246',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#DE5246',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    elevation: 5,
    height: '25%',
    width: '70%',
  },
  buttonOpen: {
    backgroundColor: '#000',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: '#000',
    fontSize: 17,
    marginBottom: 15,
  },
  modalText: {
    marginBottom: 15,
    fontWeight: '700',
    fontSize: 18,
  },
});
