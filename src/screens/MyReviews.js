import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { GET_ALL_MAGAZINE_LIST } from '../constants/queries';
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


  handleSearch = (text) => {
    this.setState({
      textnew: text,
    });
    let vdata = this.state.setAllcartcount.filter(i =>
      i.magazineName.toLowerCase().includes(text.toLowerCase()))
    this.setState({ data: vdata });
  };

  async fetchToken() {
    let token = await AsyncStorage.getItem('userToken');
    let userInfo = await AsyncStorage.getItem('userInfo');
    this.setState({
      userInfo: JSON.parse(userInfo),
    });
    this.setState({
      userTokenData: token
    });
    this.getShoppingCart(token);
  }


  async fetchTokenNew() {
    let token = await AsyncStorage.getItem('userToken');
    let userInfo = await AsyncStorage.getItem('userInfo');
    this.setState({
      userInfo: JSON.parse(userInfo),
    });
    this.setState({
      userTokenData: token
    });
    this.getrequestItem(token);
    console.log('token', token);
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

  getShoppingCart(Token) {
    this.setState({ cartLoading: true });
    client
      .query({
        query: GET_ALL_MAGAZINE_LIST,
        context: {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        },
        variables: {
          size: this.state.offset
        },
      })
      .then(result => {
        console.log(result.data.getMagazinesList.result);
        this.setState({ cartLoading: false });
        this.setState({ data: result.data.getMagazinesList.result })
        this.setState({ setAllcartcount: result.data.getMagazinesList.result })
      })
      .catch(err => {
        this.setState({ cartLoading: false });
        console.log(err);
      });
  }
  getrequestItem() {
    if (!this.state.cartLoading) {
      this.setState({ cartLoading: true });
      client
        .query({
          query: GET_ALL_MAGAZINE_LIST,
          fetchPolicy: 'no-cache',
          variables: {
            size: this.state.offset,
          },
          context: {
            headers: {
              Authorization: `Bearer ${this.state.userTokenData}`,
            },
          },
        })
        .then(result => {
          this.setState({ cartLoading: false });
          this.setState({ data: result.data.getMagazinesList.result })
          this.setState({ setAllcartcount: result.data.getMagazinesList.result })
        })
        .catch(err => {
          this.setState({ cartLoading: false });
          console.log(err);
        });
    }
  }

  renderItem = ({ item, index }) => (
    <TouchableOpacity key={index} onPress={() => { this.props.navigation.push('Catalogue36', { detail: item }) }} activeOpacity={0.9}>
      <View style={styles.main}>
        <View>
          <View style={{ width: 1, height: 80, backgroundColor: '#D0D0D0', marginLeft: 87, marginTop: 10, }} />
          <Image
            style={styles.image}
            source={item.itemImagePath ? { uri: `${imagePrefix}${item.mapEflyersUploadDtos[0].documentName}` } : require('../assets/NoImage.jpeg')}
          />
        </View>
        <View>
          <Text style={styles.text} numberOfLines={1}>{item.magazineName}</Text>
          {/* Adding Star Review */}
          <View style={{ marginLeft: 107, bottom : 68, alignItems: 'flex-start',}}>
            <Rating imageSize={16} readonly startingValue={item.ratingScore} />
          </View>
          <Text style={{ marginLeft: 110, bottom: 65, color: '#A8A8A8', fontSize: 11, }}>
            {Moment(item.startDate).format('DD-MMM-YYYY')}
          </Text>
          <Text numberOfLines={1} style={{ marginLeft: 110, bottom: 60, color: '#323232', fontSize: 11, }}>
            {item.eFlyerDescription}
          </Text>
        </View>
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
            onEndReached={this.fetchMoreUsers}
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
    height: 100,
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
    marginTop: -75,
    marginLeft: 10,
  },
  text: {
    marginLeft: 110,
    bottom: 70,
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
});
