import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  ToastAndroid,
  FlatList,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { GET_SPECIAL } from '../../constants/queries'
import client from '../../constants/client';
import { GetRating } from '../../components/GetRating';
import { imagePrefix } from '../../constants/utils';
import Moment from 'moment';

export default class FaqScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      data: [],
      special_data: [],
      dataFixed: [],
      userTokenData: '',
      loading: false,
      userInfo: {},
      cartLoading: false,
      isListEnd: false,
      faqs: '',
      str: '',
      textnew: [],
      isLoading: true,
      rating: "2",
      maxRating: [1, 2, 3, 4, 5],
      offset: 10,
      starImageFilled:
        'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_filled.png',
      starImageCorner:
        'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_corner.png',

    };
  }


  componentDidMount() {
    this.fetchToken();
  }

  fetchMoreUsers = () => {
    this.setState(
      prevState => ({
        offset: prevState.offset + 10,
      }),
      () => {
        this.getrequestItem();
      },
    );
  }

  getrequestItem() {
    if (!this.state.loading && !this.state.isListEnd) {
      this.setState({ cartLoading: true });
      client
        .query({
          query: GET_SPECIAL,
          // fetchPolicy: 'no-cache',
          context: {
            headers: {
              Authorization: `Bearer ${this.state.userTokenData}`,
              // 'Content-Length': 0,
            },
          },
          variables: {
            size: this.state.offset,
          },
        })
        .then(result => {
          console.log("ccccccccccccccccccccccccccccccccccccccccccc", result)
          this.setState({ data: result.data.getMstSpecialList.result });
          this.setState({ dataFixed: result.data.getMstSpecialList.result });
          this.setState({ loading: false });
          // this.setState({isListEnd:false});
        })
        .catch(err => {
          this.setState({ loading: false });
          this.setState({ isListEnd: true });
          console.log(err);
        });
    }
  }

  handleSearch = (text) => {
    this.setState({
      textnew: text,
    });
    let vdata = this.state.dataFixed.filter(i =>
      i.specialName.toLowerCase().includes(text.toLowerCase()))
    this.setState({ data: vdata });
    //  this.setState({ onEndReachedLength: 10 });
  };

  async fetchToken() {
    let token = await AsyncStorage.getItem('userToken');
    this.setState({
      userTokenData: token
    });
    this.fetchProducts(token);
  }
  async fetchProducts(token) {
    console.log('this.state.offset', this.state.offset)
    if (!this.state.loading && !this.state.isListEnd) {
      this.setState({ loading: true });
      client
        .query({
          query: GET_SPECIAL,
          // fetchPolicy: 'no-cache',
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
              // 'Content-Length': 0,
            },
          },
          variables: {
            size: this.state.offset,
          },
        })

        .then(async result => {
          console.log(result.data.getMstSpecialList.result);
          if (result.data.getMstSpecialList.success) {
            this.setState({ data: result.data.getMstSpecialList.result });
            this.setState({ dataFixed: result.data.getMstSpecialList.result });
            this.setState({ loading: false });
          } else {
            this.setState({ loading: false });
            this.setState({ isListEnd: true });
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
  }



  renderItem = ({ item, index }) => {
    let imagege = '';
    if (item.mapSpecialUpload.length > 0) {
      imagege = item.mapSpecialUpload[0].uploadPath;
      // console.log('imagege', imagege)
    } else {
      imagege = '';
    }
    return (
      <View key={index} style={{ marginBottom: -25 }}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            this.props.navigation.navigate('Special', { data: item });
          }}>
          <View style={styles.main}>
            <View style={{ width: "22%", justifyContent: "center" }}>

              <Image
                style={styles.image}
                source={imagege
                  ?
                  { uri: `${imagePrefix}${imagege}` }
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

              <Text style={styles.text} numberOfLines={1}>
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
                        style={styles.starImageStyle}
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
      </View>
    );
  }
  renderFooter = () => {
    return (
      // Footer View with Loader
      <View style={styles.footer}>
        {this.state.loading ? (
          <ActivityIndicator
            color="black"
            style={{ margin: 15 }} />
        ) : null}
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
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
                  placeholder="Search for a specials"
                  underlineColorAndroid="transparent"
                  onChangeText={queryText => this.handleSearch(queryText)}
                />
              </View>

              <FlatList
                keyExtractor={(item, i) => i}
                data={this.state.data}
                ListFooterComponent={this.renderFooter}
                renderItem={this.renderItem}
                onEndReached={this.fetchMoreUsers}
                onEndReachedThreshold={0.5}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}

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
    marginBottom: 30,
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