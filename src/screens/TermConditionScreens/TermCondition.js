import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity, TextInput, SafeAreaView, ScrollView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Moment from 'moment';
import { imagePrefix } from '../../constants/utils';
import { GET_BUSINESS } from '../../constants/queries';
import client from '../../constants/client';
import { GetRating } from '../../components/GetRating';

const TermCondition = ({ navigation }) => {
  const [data, setData] = useState([])
  const [dataSave, setDataSave] = useState([])
  const [maxRating, setMaxrating] = useState([1, 2, 3, 4, 5,])
  const [rating, setRating] = useState("2")
  const [loading, setLoading] = useState(false);
  const [isListEnd, setIsListEnd] = useState(false);
  const [offset, setOffset] = useState(10);
  const [textnew, settextnew] = useState('');
  const [endDistance, setEndDistance] = useState(0.5);
  const [loadMoreNext, setLoadMoreNext] = useState(true);
  const [userToken, setUserToken] = useState('');
  const [userInfo, setUserInfo] = useState([]);

  const starImageFilled =
    'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_filled.png';
  const starImageCorner =
    'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_corner.png';
  useEffect(() => {
    getrequestItem();
  }, []);

  const handleSearch = (text) => {
    settextnew(text)
    let vdata = dataSave.filter(i =>
      i.companyName.toLowerCase().includes(text.toLowerCase()))
    setData(vdata);
    setLoadMoreNext(false);
  };
  const getrequestItem = async () => {
    let resultdata = await AsyncStorage.getItem('userInfo');
    let jsondata = JSON.parse(resultdata);
    let token = await AsyncStorage.getItem('userToken');
    setUserToken(token)
    setUserInfo(jsondata)
    getrequestItemtt(token)
  }
  const getrequestItemtt = (token) => {
    if (loadMoreNext) {
      setLoading(true);
      client
        .mutate({
          mutation: GET_BUSINESS,
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          variables: {
            userId: Number(userInfo?.id),
            size: offset
          },
        })
        .then(async result => {
          if (result.data.getBusinessList.success) {
            setData(result.data.getBusinessList.result)
            setDataSave(result.data.getBusinessList.result)
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


  const getrequestItemNext = () => {
    if (loadMoreNext) {
      setLoading(true);
      client
        .mutate({
          mutation: GET_BUSINESS,
          context: {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          },
          variables: {
            userId: Number(userInfo?.id),
            size: offset
          },
        })
        .then(async result => {
          if (result.data.getBusinessList.success) {
            setData(result.data.getBusinessList.result)
            setDataSave(result.data.getBusinessList.result)
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
        {loading ? <ActivityIndicator color="black" style={{ margin: 15 }} /> : null}
      </View>
    );
  };


  const renderItem = ({ item, index }) => (
    <View key={index}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => { navigation.navigate('WhiteHouseInteriors', { detail: item }); }}>
        <View style={styles.main}>
          <View style={{ width: "22%", justifyContent: "center" }}>
            <Image
              style={styles.image}
              source={item.logoPath ? { uri: `${imagePrefix}${item.logoPath}` } : require('../../assets/NoImage.jpeg')}
            />
          </View>
          <View style={{ width: "0.5%", backgroundColor: '#D0D0D0', height: "80%", alignSelf: "center" }} />
          <View style={{ width: "77%" }}>
            <Text style={styles.text} numberOfLines={1}>
              {item.companyName}
            </Text>
            <GetRating companyId={item.companyId} onprogress={(Rating) => setRating(Rating)} />
            <View style={{ flexDirection: "row", margin: 10 }}>
              {maxRating.map((item, key) => {
                return (
                  <TouchableOpacity activeOpacity={0.7} key={key}>
                    <Image
                      style={styles.starImageStyle}
                      source={item <= rating ? { uri: starImageFilled } : { uri: starImageCorner }}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={{ color: '#A8A8A8', fontSize: 11, marginLeft: 10 }}>
              {Moment(item.joinDate).format('DD-MMM-YYYY')}
            </Text>
            <Text style={{ color: '#323232', fontSize: 11, marginLeft: 10 }}>
              {item.compCityName}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <View style={styles.SectionStyle}>
            <Image
              source={require('../../assets/search.png')}
              style={styles.ImageStyle}
            />

            <TextInput
              style={{ flex: 1 }}
              placeholder="Search for a business"
              underlineColorAndroid="transparent"
              onChangeText={queryText => handleSearch(queryText)}
            />
          </View>
          <FlatList
            data={data}
            keyExtractor={(item, i) => i}
            ListFooterComponent={renderFooter}
            renderItem={renderItem}
            onEndReached={getrequestItemNext}
            onEndReachedThreshold={endDistance}
          />
        </View>
        <View style={{ marginBottom: 20 }}></View>
      </ScrollView>
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
    height: 40,
    width: 64,
    marginLeft: 10,
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

export default TermCondition;
