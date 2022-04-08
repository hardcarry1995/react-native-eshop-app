import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, SafeAreaView, ScrollView, Alert, ToastAndroid } from 'react-native';
import Moment from 'moment';
import { imagePrefix } from '../../constants/utils';
import { GET_MAGAZINES_LIST, ADD_CUSTOMER_ENQUIRY } from '../../constants/queries';
import AsyncStorage from '@react-native-community/async-storage';
import client from '../../constants/client';
import { GetRating } from '../../components/GetRating';
import { Rating } from "react-native-elements";
import fileExtention from "file-extension";
import { SliderBox } from "react-native-image-slider-box";
import FontawesomeIcon from "react-native-vector-icons/FontAwesome";
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";

const Catalogue36 = ({ navigation, route }) => {
  const detailData = route.params.detail;
  const [magazinData, setMagazine] = useState([]);
  const [rating, setRating] = useState('2');
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
  const [starImageFilled, setstarImageFilled] = useState('https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_filled.png');
  const [starImageCorner, setstarImageCorner] = useState('https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_corner.png');
  const [images, setImages ] = useState([]);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const files = detailData.mapEflyersUploadDtos;
    const imageFiles = [];
    const documentFiles = [];
    files.forEach(file => {
      const extOfFile = fileExtention(file.filePath);
      if(extOfFile == 'jpg' || extOfFile == 'jpeg' || extOfFile == 'png' || extOfFile == 'gif'){
        const fullUrl = `${imagePrefix}${file.filePath}`
        imageFiles.push(fullUrl);
      } else if (extOfFile == 'doc' || extOfFile == 'docx' || extOfFile == 'pdf' || extOfFile == 'xls' || extOfFile == 'xlsx') {
        documentFiles.push({ ...file, ext: extOfFile });
      }
    });
    setImages(imageFiles);
    setDocuments(documentFiles);
    fetchToken();
  }, []);

  const fetchToken = async () => {
    let token = await AsyncStorage.getItem('userToken');
    fetchProducts(token);
  }

  const fetchProducts = async (token) => {
    client
      .query({
        query: GET_MAGAZINES_LIST,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        variables: {
          id: detailData.companyId.toString(),
        },
      })
      .then(result => {
        setMagazine(result.data.getMagazinesList.result);
      })
      .catch(err => {
        console.log(err);
      });
  }

  const nagotiatePrice = async (item) => {
    let token = await AsyncStorage.getItem('userToken');
    console.log('item', item)
    client
      .mutate({
        mutation: ADD_CUSTOMER_ENQUIRY,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        variables: {
          companyId: item.companyId,
          enquiryDescription: item.eFlyerDescription,
          title: item.magazineName,
        },
      })
      .then(result => {
        if (result.data.addCustomerEnquiry.success) {
          Alert.alert('Success', result.data.addCustomerEnquiry.message)
        } else {
          ToastAndroid.show(
            result.data.getMstSpecialList.message,
            ToastAndroid.SHORT,
          );
        }
      })
      .catch(err => {
        console.log(err);
      });

  }
  const renderItem = ({ item, index }) => (
    <View style={{ marginBottom: 10 }}>
      {detailData.eflyerId !== item.eflyerId &&
        <TouchableOpacity onPress={() => { navigation.navigate('CatalogueNew', { data: item }); }}>
          <View style={styles.maint}>
            <View style={{ width: "22%", justifyContent: "center" }}>
              <Image
                style={styles.imaget}
                source={item.itemImagePath ? { uri: `${imagePrefix}${item.mapEflyersUploadDtos[0].documentName}` } : require('../../assets/NoImage.jpeg')}
              />
            </View>
            <View style={{ width: "0.5%", backgroundColor: '#fff', height: "80%", alignSelf: "center" }} />
            <View style={{ width: "77%" }}>
              <Text style={styles.textt}>
                {item.magazineName}
              </Text>
              <GetRating companyId={item.itemRequestID} onprogress={(Rating) => setRating(Rating)} />
              <View style={{ flexDirection: "row", margin: 10 }}>
                {maxRating.map((ritem, key) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      key={ritem}
                    >
                      <Image
                        style={styles.starImageStyle2}
                        source={ ritem <= rating ? { uri: starImageFilled } : { uri: starImageCorner } }
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={{ color: '#A8A8A8', fontSize: 11, marginLeft: 10 }}>
                {Moment(item.startDate).format('DD-MMM-YYYY')}
              </Text>
              <Text numberOfLines={1} style={{ color: '#323232', fontSize: 11, marginLeft: 10 }}>
                {item.eFlyerDescription}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      }
      {magazinData.length === 1 &&
        <Text style={{ color: '#232323', fontSize: 18, padding: 15, marginTop: -20, opacity: 0.7 }}>
          No magazin found
        </Text>
      }
    </View>
  );

  const EmptyListMessage = (item) => {
    return (
      <Text style={{ color: '#232323', fontSize: 18, padding: 15, marginTop: -20, opacity: 0.7 }}>
        {item}
      </Text>
    );
  };

  const onPressDownloadFile = file => {
    const fullUrl = `${imagePrefix}${file.filePath}`;
    const tempfilename = `temperary_${Date.now()}.${file.ext}`;
    const localFile = `${RNFS.DocumentDirectoryPath}/${tempfilename}`;
    const options = {
      fromUrl: fullUrl,
      toFile: localFile,
    };
    RNFS.downloadFile(options)
      .promise.then(() => FileViewer.open(localFile))
      .then(() => {
        // success
        console.log("Success")
      })
      .catch((error) => {
        // error
        console.log(error);
      });
  }


  return (
    <ScrollView>
      <View>
        <View style={{ marginTop: 20}}>
          {images.length === 0 ? <Image
            style={{ height: 190, width: 360, alignSelf: 'center' }}
            source={detailData.itemImagePath ? { uri: `${imagePrefix}${detailData.mapEflyersUploadDtos[0].documentName}` } : require('../../assets/NoImage.jpeg')}
            resizeMode="contain"
          /> : <SliderBox  images={images} />}
        </View>
        <View style={{}}>
          <View style={styles.main}>
            <View>
              <Text style={{ color: '#9F1D20', fontSize: 21, padding: 15 }}>
                {detailData.magazineName}
              </Text>
              <View style={{ flexDirection: "row"}}>
                <Text style={{ color: '#232323', marginLeft: 15, fontSize: 15 }}>
                  Company Name
                </Text>
                <Text style={{ marginLeft: 10, color: '#C9C9C9' }}>
                  {detailData.companyName}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "flex-start", marginTop: 20}}>
                <Text style={{ color: '#232323', marginLeft: 15, fontSize: 15, }}>
                  Address
                </Text>
                <Text style={{ color: '#C9C9C9', marginLeft: 10, fontSize: 15, width: 280}}>
                  {detailData.companyLocation}
                </Text>
              </View>

              <View style={{ flexDirection: "row", marginTop: 20, alignItems: "flex-start"}}>
                <Text style={{ color: '#232323', marginLeft: 15, fontSize: 15, }}>
                  Start Date
                </Text>
                <Text style={{ color: '#C9C9C9', marginLeft: 10, fontSize: 15, }}>
                  {Moment(detailData.startDate).format('DD-MMM-YYYY')}
                </Text>
              </View>
              <View style={{ flexDirection: "row", marginTop: 20, alignItems: "flex-start"}}>
                <Text style={{ color: '#232323', marginLeft: 15, fontSize: 15,  }}>
                  End Date
                </Text>
                <Text style={{ color: '#C9C9C9', marginLeft: 16, fontSize: 15, }}>
                  {Moment(detailData.endDate).format('DD-MMM-YYYY')}
                </Text>
              </View>
             
              <Text style={{ color: '#232323', marginLeft: 15, fontSize: 15, marginTop: 18, }}>
                Description
              </Text>
              <Text style={{ color: '#C9C9C9', marginLeft: 15, fontSize: 15, marginTop: 10, }}>
                {detailData.eFlyerDescription}
              </Text>

              <Text style={{ color: '#232323', marginLeft: 15, fontSize: 15, marginTop: 18, }}>Other documents:</Text>
              <View style={{ flexDirection: 'row', paddingHorizontal: 15, marginTop : 10}}>
                
                {documents.map((file) => {
                  if(file.ext == 'pdf') {
                    return (
                    <TouchableOpacity onPress={() => onPressDownloadFile(file)}>
                      <FontawesomeIcon name="file-pdf-o" color="red" size={36} />
                    </TouchableOpacity> )
                  }
                  if(file.ext == "doc" || file.ext == 'docx'){
                    return (
                      <TouchableOpacity onPress={() => onPressDownloadFile(file)}>
                        <FontawesomeIcon name="file-word-o" color="blue" size={36}  />
                      </TouchableOpacity>
                    )
                  }
                  if(file.ext == 'xls' || file.ext === 'xlsx'){
                    return (
                    <TouchableOpacity onPress={() => onPressDownloadFile(file)}>
                      <FontawesomeIcon name="file-excel-o" color="green" size={36} />
                    </TouchableOpacity>)
                  }
                })}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.main2}>
          <TouchableOpacity
            onPress={() => {
              nagotiatePrice(detailData);
            }}
            style={{ height: 40, width: 240, backgroundColor: '#9F1D20', marginBottom: 25, borderRadius: 5, alignItems: 'center', justifyContent: 'center'}}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '700', letterSpacing: 1 }}>
              Contact Business
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              nagotiatePrice(detailData);
            }}
            style={{ height: 40, width: 240, backgroundColor: '#9F1D20', marginBottom: 25, borderRadius: 5, justifyContent: 'center', alignItems: 'center'}}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '700', letterSpacing: 1 }}>
              Negotiate Price
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.main3}>
          <Text style={{ color: '#9F1D20', fontSize: 21 }}>
            Rating
          </Text>
          <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 10}}>5</Text>
          <Rating imageSize={24} readonly startingValue={5} style={{ alignItems: 'flex-start'}}  />
          <TouchableOpacity
            onPress={() => {
              navigation.push('RateScreen', { detail: detailData, type: 3 });
            }}
            style={{ height: 40, width: 160, backgroundColor: '#9F1D20', justifyContent: 'center', alignItems:'center', marginTop: 30, borderRadius: 5, }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '700', letterSpacing: 1 }}>
              Give Rating
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: 40 }}>
          <View style={styles.main4}>
            <View>
              <Text style={{ color: '#9F1D20', fontSize: 21, padding: 15 }}>
                Other Magazines by {detailData.companyName}
              </Text>
              <FlatList
                ListEmptyComponent={EmptyListMessage('No magazines found')}
                data={magazinData}
                keyExtractor={(item, i) => i}
                renderItem={renderItem}
              />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
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
    paddingBottom: 20
  },
  image: {
    height: 64,
    width: 64,
    marginTop: 17,
    marginLeft: 10,
  },
  text: {
    marginLeft: 110,
    bottom: 70,
    color: '#323232',
  },
  main2: {
    backgroundColor: 'white',
    borderRadius: 15,
    shadowRadius: 20,
    elevation: 8,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 25

  },
  main3: {
    backgroundColor: 'white',
    borderRadius: 15,
    shadowRadius: 20,
    elevation: 8,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 20,
    paddingVertical: 25,
    alignItems: 'center',
  },
  main4: {
    // height: 105,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowRadius: 20,
    elevation: 8,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 20,
  }, maint: {
    height: 100,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowRadius: 20,
    elevation: 8,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 10,
    flexDirection: "row",
  },
  starImageStyle2: {
    width: 20,
    height: 20,
  },
  imaget: {
    height: 65,
    width: 65,
    marginLeft: 5,
    resizeMode: 'contain',
  },
  textt: {
    marginLeft: 10,
    color: '#323232',
  },
  SectionStylet: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#F54D30',
    height: 43,
    borderRadius: 5,
    margin: 15,
  },
});

export default Catalogue36;
