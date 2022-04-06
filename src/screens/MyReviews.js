import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { GET_ALL_MAGAZINE_LIST, GET_RATING_LIST } from '../constants/queries';
import client from '../constants/client';
import Moment from 'moment';
import { Rating } from 'react-native-elements';


export default class MyReviews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      faqs: '',
      str: '',
      isLoading: true,
      offset: 10,
      cartLoading: false,
      data: [],
      setAllcartcount: [],
      userInfo: [],
      userTokenData: ''
    };
  }

  componentDidMount() {
    this.fetchToken();
  }

  async fetchToken() {
    let token = await AsyncStorage.getItem('userToken');
    let userInfo = await AsyncStorage.getItem('userInfo');
    this.setState({
      userInfo: JSON.parse(userInfo),
    });
    this.setState({
      userTokenData: token
    });
    this.getRatingList(token);
  }


  fetchMoreReviews = () => {
    this.setState(
      prevState => ({
        offset: prevState.offset + 10,
      }),
      () => {
        this.getRatingList();
      },
    );
  }

  getRatingList = (token = null) => {
    this.setState({ cartLoading: true });
    client
    .query({
      query: GET_RATING_LIST,
      context: {
        headers: {
          Authorization: `Bearer ${token === null ? this.state.userTokenData : token}`,
        },
      },
      variables: {
        size: this.state.offset
      },
    })
    .then(result => {
      this.setState({ cartLoading: false });
      this.setState({ data: result.data.getRatingList.result })
      this.setState({ setAllcartcount: result.data.getRatingList.result })
    })
    .catch(err => {
      this.setState({ cartLoading: false });
      console.log(err);
    });
  }

  renderItem = ({ item, index }) => (
    <TouchableOpacity key={index} activeOpacity={0.9}>
      <View style={styles.main}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Rating imageSize={16} readonly startingValue={item.ratingScore} style={{ alignItems: 'flex-start'}} />
        <Text style={{ color: '#A8A8A8', fontSize: 11, marginVertical: 2 }}>
          {Moment(item.dateofReview).format('DD-MMM-YYYY')}
        </Text>
        <Text style={{ color: '#323232', fontSize: 11, }}>
          {item.review}
        </Text>
      </View>
    </TouchableOpacity>
  );

  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView>
          <FlatList
            ListFooterComponent={() => {
              return (
                this.state.cartLoading ? (
                  <View style={{ padding: 10 }}>
                    <ActivityIndicator size="large" color="#000" />
                  </View>
                ) : null
              )
            }}
            keyExtractor={(item, i) => i}
            data={this.state.data}
            renderItem={this.renderItem}
            onEndReached={this.fetchMoreReviews}
            onEndReachedThreshold={0.5}
          />
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
    backgroundColor: 'white',
    borderRadius: 15,
    shadowRadius: 20,
    elevation: 8,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  image: {
    height: 64,
    width: 64,
    marginTop: -75,
    marginLeft: 10,
  },
  name : {
    color: '#323232',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5
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
});
