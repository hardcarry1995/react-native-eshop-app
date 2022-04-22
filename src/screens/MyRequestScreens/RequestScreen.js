import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { imagePrefix } from '../../constants/utils';
import { REQUEST_ITEM_GET } from '../../constants/queries';
import AsyncStorage from '@react-native-community/async-storage';
import client from '../../constants/client';
import { GetRating } from '../../components/GetRating';
import Moment from 'moment';
import fileExtention from "file-extension";

const Request24 = ({ navigation }) => {
  const [data, setData] = useState([])
  const [maxRating, setMaxrating] = useState([1, 2, 3, 4, 5,])
  const [rating, setRating] = useState("2")
  const [loading, setLoading] = useState(false);
  const [isListEnd, setIsListEnd] = useState(false);
  const [offset, setOffset] = useState(10);

  const starImageFilled = 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_filled.png';
  const starImageCorner = 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_corner.png';

  useEffect(() => {
    getrequestItem();
  }, []);

  const getrequestItem = async () => {
    let resultdata = await AsyncStorage.getItem('userInfo');
    let jsondata = JSON.parse(resultdata);
    let token = await AsyncStorage.getItem('userToken');
    if (!loading && !isListEnd) {
      setLoading(true);
      client
        .mutate({
          mutation: REQUEST_ITEM_GET,
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          variables: {
            userId: Number(jsondata.id),
            size: offset
          },
        })
        .then(async result => {
          if (result.data.getItemRequestList.success) {
            setData(result.data.getItemRequestList.result)
            setOffset(offset + 10);
            setLoading(false);
          } else {
            setIsListEnd(true);
            setLoading(false);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        {loading ? (
          <ActivityIndicator
            color="black"
            style={{ margin: 15 }} />
        ) : null}
      </View>
    );
  };


  const renderItem = ({ item, index }) => {
    const uploadedFiles = item.mapItemRequestUploadDto;
    let imagePath = item.itemImagePath;
    if(item.itemImagePath == null && uploadedFiles){
      let images = uploadedFiles.map(file => {
        const extOfFile = fileExtention(file.filePath);
        if(extOfFile == 'jpg' || extOfFile == 'jpeg' || extOfFile == 'png' || extOfFile == 'gif'){
          return file.uploadPath;
        } 
      });
      images = images.filter(url => url !== null);
      imagePath = images[0];
    }
    return (
    <View>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          navigation.push('RequestNew25', { data: item });
        }}>
        <View style={styles.main}>
          <View style={{ width: "22%", justifyContent: "center" }}>
            <Image
              style={styles.image}
              source={imagePath ? { uri: `${imagePrefix}${imagePath}` } : require('../../assets/NoImage.jpeg')}
            />
          </View>

          <View style={{ width: "0.5%", backgroundColor: '#D0D0D0', height: "80%", alignSelf: "center" }} />
          <View style={{ width: "77%" }}>
            <Text style={styles.text}>
              {item.itemRequestTitle}
            </Text>
            <GetRating companyId={item.itemRequestID} onprogress={(Rating) => setRating(Rating)} />
            <View style={{ flexDirection: "row", margin: 10 }}>
              {maxRating.map((item, key) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    key={item}
                  >
                    <Image
                      style={styles.starImageStyle}
                      source={ item <= rating ? { uri: starImageFilled } : { uri: starImageCorner } }
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={{ color: '#A8A8A8', fontSize: 11, marginLeft: 10 }}>
              {Moment(item.itemRequestDate).format('DD-MMM-YYYY')}
            </Text>
            <Text numberOfLines={1} style={{ color: '#323232', fontSize: 11, marginLeft: 10 }}>
              {item.itemRequestDescription}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )};


  return (
    <SafeAreaView>
      <FlatList
        data={data}
        keyExtractor={(item, i) => i}
        ListFooterComponent={renderFooter}
        renderItem={renderItem}
        onEndReached={getrequestItem}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    height: 100,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowRadius: 20,
    elevation: 8,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 20,
    flexDirection: "row",
  },
  image: {
    height: 65,
    width: 65,
    marginLeft: 5,
    resizeMode: 'contain',
  },
  text: {
    marginLeft: 10,
    color: '#323232',
  },
  SectionStyle: {
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

  ImageStyle: {
    padding: 10,
    margin: 5,
    height: 20,
    width: 20,
    resizeMode: 'stretch',
    alignItems: 'center',
  },
  starImageStyle: {
    width: 20,
    height: 20,
  },
});

export default Request24;
