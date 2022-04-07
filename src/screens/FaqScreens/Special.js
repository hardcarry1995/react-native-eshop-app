import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, ScrollView, FlatList, ToastAndroid } from 'react-native';
import Moment from 'moment';
import { imagePrefix } from '../../constants/utils';
import AsyncStorage from '@react-native-community/async-storage';
import client from '../../constants/client';
import { GetRating } from '../../components/GetRating';
import { GET_SPECIAL_BY_ID, GET_COMPANY_NAME, ADD_CUSTOMER_ENQUIRY } from '../../constants/queries';
import { Alert } from 'react-native';
import { Rating } from "react-native-elements";

export default class Special extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      rating: "2",
      maxRating: [1, 2, 3, 4, 5], 
      email: '',
      password: '',
      data: [],
      special_data: [],
      loading: false,
      userInfo: {},
      cartLoading: false,
      isListEnd: false,
      companyName: '',
      specialData: [],
      faqs: '',
      str: '',
      Companydata: [],
      isLoading: true,
      starImageFilled:
        'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_filled.png',
      starImageCorner:
        'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_corner.png',
    };
  }


  componentDidMount() {
    this.fetchToken();
  }

  async fetchToken() {
    let token = await AsyncStorage.getItem('userToken');
    this.fetchProducts(token);
    this.fetchCompanyName(token);
  }
  async fetchProducts(token) {
    const { navigation, route } = this.props;
    const data = route.params.data;
    console.log(data.companyIds);
    client
      .query({
        query: GET_SPECIAL_BY_ID,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        variables: {
          id: data.companyIds,
        },
      })
      .then(result => {
        if (result.data.getMstSpecialList.success) {
          this.setState({ Companydata: result.data.getMstSpecialList.result });
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
  async nagotiatePrice(item) {
    let token = await AsyncStorage.getItem('userToken');
    client
      .mutate({
        mutation: ADD_CUSTOMER_ENQUIRY,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        variables: {
          companyId: parseInt(item.companyIds),
          enquiryDescription: item.specialDescription,
          title: item.specialName,
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
  async getQuotation(itemData) {
    if (itemData.imagePath == null) {
      const imageName = '';
    } else {
      const imageName = itemData.imagePath;
    }
    this.props.navigation.navigate('RequestStack', {
      categoryId: itemData.categoryID,
      subCategoryId: itemData.suburbID,
      subCategoryName: itemData.categoryName
    });
  }

  async fetchCompanyName(token) {
    const { navigation, route } = this.props;
    const data = route.params.data;
    this.setState({ specialData: data })
    // console.log('GET_COMPANY_NAME>>>>>>>', data)
    client
      .query({
        query: GET_COMPANY_NAME,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
            // 'Content-Length': 0,
          },
        },
        variables: {
          id: data.companyIds,
        },
      })
      .then(result => {
        if (result.data.getBusinessList.success) {
          this.setState({ companyName: result.data.getBusinessList.result[0].companyName });
        } else {
          ToastAndroid.show(
            result.data.getBusinessList.message,
            ToastAndroid.SHORT,
          );
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  EmptyListMessage = (item) => {
    return (
      <Text
        style={{
          color: '#232323',
          fontSize: 18,
          padding: 15,
          marginTop: -20,
          opacity: 0.7,
        }}>
        {item}
      </Text>
    );
  };


  renderItem = ({ item, index }) => (
    <View style={{ marginBottom: 10 }} key={index}>
      {this.state.specialData.specialID !== item.specialID &&
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.push('Special', { data: item });
          }}>
          <View style={styles.maint}>
            <View style={{ width: "22%", justifyContent: "center" }}>
              <Image
                style={styles.imaget}
                source={item.imagePath
                  ?
                  { uri: `${imagePrefix}${item.imagePath}` }
                  :
                  require('../../assets/NoImage.jpeg')}
              />
            </View>

            <View
              style={{
                width: "0.5%",
                backgroundColor: '#fff',
                height: "80%",
                alignSelf: "center"
              }}
            />

            <View style={{ width: "77%" }}>

              <Text style={styles.textt} numberOfLines={1}>
                {item.specialName}
              </Text>
              <GetRating companyId={item.specialID} onprogress={(Rating) => { this.setState({ rating: Rating }); }} />
              <View style={{ flexDirection: "row", margin: 10 }}>
                {this.state.maxRating.map((item, key) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      key={item}
                    >
                      <Image
                        style={styles.starImageStyle2}
                        source={
                          item <= this.state.rating
                            ? { uri: this.state.starImageFilled }
                            : { uri: this.state.starImageCorner }
                        }
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text
                style={{
                  color: '#A8A8A8',
                  fontSize: 11,
                  marginLeft: 10
                }}>
                {Moment(item.startDate).format('DD-MMM-YYYY')}
              </Text>
              <Text numberOfLines={1}
                style={{
                  color: '#323232',
                  fontSize: 11,
                  marginLeft: 10
                }}>
                {item.specialDescription}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      }
    </View>
  );


  render() {
    const { navigation, route } = this.props;
    const data = route.params.data;
    let imagege = '';
    if (data.mapSpecialUpload.length > 0) {
      imagege = data.mapSpecialUpload[0].uploadPath;
    } else {
      imagege = '';
    }
    return (
      <ScrollView ref={(ref) => { this.scrollView = ref; }}>
        <View>
          <Image 
            style={styles.image2} 
            source={imagege !== "" ? { uri: `${imagePrefix}${imagege}` } : require('../../assets/NoImage.jpeg')}
            resizeMode="contain"
          />
        </View>
        <View style={{}}>
          <View style={styles.main}>
            <View>
              <Text style={{ color: '#9F1D20', fontSize: 21, padding: 15 }}>
                {data.specialName}
              </Text>
              <Text style={{ color: '#232323', marginLeft: 15, fontSize: 15 }}>
                Company Name
              </Text>
              <Text style={{ marginLeft: 135, marginTop: -20, color: '#C9C9C9' }}>
                {this.state.companyName}
              </Text>
              <Text style={{ color: '#232323', marginLeft: 15, fontSize: 15, marginTop: 20, }}>
                Category
              </Text>
              <Text style={{ color: '#E22727', marginLeft: 15, fontSize: 15 }}>
                {data.categoryName}
              </Text>
              <Text style={{ color: '#232323', marginLeft: 15, fontSize: 15, marginTop: 18 }}>
                Amount
              </Text>
              <Text style={{ color: '#C9C9C9', marginLeft: 95, fontSize: 15, marginTop: -20 }}>
                {data.amount}
              </Text>
              <Text style={{ color: '#232323', marginLeft: 15, fontSize: 15, marginTop: 18 }}>
                Start Date
              </Text>
              <Text style={{ color: '#C9C9C9', marginLeft: 95, fontSize: 15, marginTop: -20 }}>
                {Moment(data.startDate).format('DD-MMM-YYYY')}
              </Text>
              <Text style={{ color: '#232323', marginLeft: 15, fontSize: 15, marginTop: 18 }}>
                End Date
              </Text>
              <Text style={{ color: '#C9C9C9', marginLeft: 95, fontSize: 15, marginTop: -20  }}>
                {Moment(data.endDate).format('DD-MMM-YYYY')}
              </Text>
              <Text style={{ color: '#232323', marginLeft: 15, fontSize: 15, marginTop: 18 }}>
                Description
              </Text>
              <Text style={{ color: '#C9C9C9', marginLeft: 15, fontSize: 15, marginTop: -2, marginBottom: 10 }}>
                {data.specialDescription}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <View style={styles.main2}>
            <View>
              <TouchableOpacity
                onPress={() => { this.getQuotation(data); }}
                style={{ height: 40, width: 240, backgroundColor: '#9F1D20', alignSelf: 'center', marginTop: 25, borderRadius: 5}}
              >
                <Text style={{ alignSelf: 'center', marginTop: 8, color: '#FFFFFF', fontSize: 15, }}>
                  Get Quotations
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => { this.nagotiatePrice(data); }}
                style={{ height: 40, width: 240, backgroundColor: '#9F1D20', alignSelf: 'center', marginTop: 25, borderRadius: 5 }}
              >
                <Text style={{ alignSelf: 'center', marginTop: 8, color: '#FFFFFF', fontSize: 15 }}>
                  Negotiate Price
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{}}>
          <View style={styles.main3}>
            <View>
              <Text style={{ color: '#9F1D20', fontSize: 21, alignSelf: 'center', marginTop: 10 }}>
                Rating
              </Text>
              <GetRating companyId={data.specialID} onprogress={(Rating) => { this.setState({ rating: Rating }); }} />
              <Text style={{ color: '#CFCFCF', fontSize: 35, alignSelf: 'center', opacity: 0.5, }}>
                {this.state.rating}
              </Text>
              <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10 }}>
                <Rating imageSize={20} readonly startingValue={this.state.rating}  />
              </View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Find Business',{ screen : "RateandReview", params : { detail: data, type: 1 }} );
                }}
                style={{ height: 40, width: 130, backgroundColor: '#9F1D20', alignSelf: 'center', marginTop: 20, borderRadius: 5, }}
              >
                <Text style={{ alignSelf: 'center', marginTop: 8, color: '#FFFFFF', fontSize: 15 }}>
                  Give Rating
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ marginBottom: 40, paddingBottom: 40 }}>
          <View style={styles.main4}>
            <View>
              <Text style={{ color: '#9F1D20', fontSize: 21, padding: 15 }}>
                Other Specials by {this.state.companyName}
              </Text>
              <FlatList
                ListEmptyComponent={this.EmptyListMessage('No special found')}
                data={this.state.Companydata}
                keyExtractor={(item, i) => i}
                renderItem={this.renderItem}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: 'white',
    borderRadius: 15,
    shadowRadius: 20,
    elevation: 8,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 20,
  },
  image: {
    height: 64,
    width: 64,
    marginTop: 17,
    marginLeft: 10,
  },
  image2: {
    height: 190,
    width: '100%',
    alignContent: 'center',
    paddingTop: 10

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
    paddingBottom: 25
  },
  main3: {
    height: 215,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowRadius: 20,
    elevation: 8,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 20,
  },
  main4: {
    backgroundColor: 'white',
    borderRadius: 15,
    shadowRadius: 20,
    elevation: 8,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 20,
  },
  starImageStyle: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
    alignSelf: 'center',
  },

  ImageStyle: {
    padding: 10,
    margin: 5,
    height: 20,
    width: 20,
    resizeMode: 'stretch',
    alignItems: 'center',
  },
  starImageStyle2: {
    width: 20,
    height: 20,
  },
  maint: {
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