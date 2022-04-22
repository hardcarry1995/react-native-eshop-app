import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, SafeAreaView, ScrollView, ToastAndroid, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { GET_SPECIAL } from '../../constants/queries'
import client from '../../constants/client';
import { imagePrefix } from '../../constants/utils';
import Moment from 'moment';
import { Rating, Chip } from "react-native-elements";
import ProductSearchInput from "../../components/ProductSearchInput";
import CategorySelector from "../../components/CategorySelector";
import Toast from "react-native-toast-message";

export default class FaqScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      special_data: [],
      dataFixed: [],
      userTokenData: '',
      loading: false,
      userInfo: {},
      cartLoading: false,
      isListEnd: false,
      textnew: [],
      isLoading: true,
      rating: "2",
      maxRating: [1, 2, 3, 4, 5],
      offset: 10,
      categories: [],
      showCategorySelector : false,
      starImageFilled: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_filled.png',
      starImageCorner: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_corner.png',
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
    if (!this.state.loading ) {
      this.setState({ loading: true });
      client
        .query({
          query: GET_SPECIAL,
          context: {
            headers: {
              Authorization: `Bearer ${this.state.userTokenData}`,
            },
          },
          variables: {
            size: this.state.offset,
            specialName : this.state.textnew == "" ? null : this.state.textnew,
            categoryIds : this.state.categories.length == 0 ? null : this.state.categories.join(",")
          },
        })
        .then(result => {
          this.setState({ data: result.data.getMstSpecialList.result });
          this.setState({ dataFixed: result.data.getMstSpecialList.result });
          this.setState({ loading: false });
        })
        .catch(err => {
          this.setState({ loading: false });
          console.log(err);
        });
    }
  }

  handleSearch = (text) => {
    this.setState(
      prevState => ({
        ...prevState,
        offset: 10,
        textnew: text,
        data: []
      }),
      () => {
        this.getrequestItem();
      },
    );
  };

  async fetchToken() {
    let token = await AsyncStorage.getItem('userToken');
    this.setState({ userTokenData: token });
    this.fetchProducts(token);
  }
  async fetchProducts(token) {
    if (!this.state.loading) {
      this.setState({ loading: true });
      client
        .query({
          query: GET_SPECIAL,
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          variables: {
            size: this.state.offset,
          },
        })

        .then(async result => {
          if (result.data.getMstSpecialList.success) {
            this.setState({ data: result.data.getMstSpecialList.result });
            this.setState({ dataFixed: result.data.getMstSpecialList.result });
            this.setState({ loading: false });
          } else {
            this.setState({ loading: false });
            Toast.show({
              type: "error",
              text1: "Error",
              text2: result.data.getMstSpecialList.message,
            });
          }
        })
        .catch(err => {
          console.log(err);
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Something went wrong. Please try again later!",
          });
        });
    }
  }

  renderItem = ({ item, index }) => {
    let imagege = '';
    if (item.mapSpecialUpload.length > 0) {
      imagege = item.mapSpecialUpload[0].uploadPath;
    } else {
      imagege = '';
    }
    return (
      <View key={index} style={{ }}>
        <TouchableOpacity key={index} onPress={() => { this.props.navigation.navigate('Special', { data: item }); }} activeOpacity={0.9}>
          <View style={styles.main}>
            <View style={{ justifyContent : 'center', alignItems : 'center'}}>
              <Image style={styles.image} source={imagege !== "" ? { uri: `${imagePrefix}${imagege}` } : require('../../assets/NoImage.jpeg')} />
            </View>
            <View style={{ paddingLeft: 20, paddingRight: 10,  paddingVertical: 10}}>
              <Text style={styles.text} numberOfLines={1}>{item.specialName}</Text>
              <View style={{ alignItems: "flex-start", marginVertical: 5 }}>
                <Rating imageSize={16} readonly startingValue={item.ratingScore} />
              </View>
              <Text style={{ color: '#A8A8A8', fontSize: 11, marginBottom: 5 }}>
                {Moment(item.startDate).format('DD-MMM-YYYY')}
              </Text>
              <Text numberOfLines={1} style={{ color: '#323232', fontSize: 11, width: 250 }}>
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
      <View style={styles.footer}>
        {this.state.loading ? (
          <ActivityIndicator
            color="black"
            style={{ margin: 15 }} />
        ) : null}
      </View>
    );
  };


  onPressFilterIcon = () => {
    this.setState({ showCategorySelector: true })
  }
  _onSelectCategoryDone = (values) => {
    this.setState(
      prevState => ({
        ...prevState,
        offset: 10,
        showCategorySelector: false, 
        categories : values,
        data: []
      }),
      () => {
        this.getrequestItem();
      },
    );
  }

  _onPressSelectedCategory = (item) => {
    const items = this.state.categories.filter((cat) => cat.categoryId != item.categoryId);
    this.setState(
      prevState => ({
        ...prevState,
        offset: 10,
        showCategorySelector: false, 
        categories : items,
        data: []
      }),
      () => {
        this.getrequestItem();
      },
    );
  }


  render() {
    return (
      <View style={styles.container}>
        <View>
          <ProductSearchInput 
            onChangeText={this.handleSearch}
            onPressFilterIcon={this.onPressFilterIcon}
          />
          {this.state.categories.length > 0 && <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom : 20, paddingHorizontal : 10}}>
            {this.state.categories.map(item => (
              <Chip 
                title={item.categoryName}
                icon={{
                  name: 'close',
                  type: 'font-awesome',
                  size: 14,
                  color: 'white',
                }}
                onPress={() => this._onPressSelectedCategory(item)}
                iconRight
                titleStyle={{ fontSize: 10 }}
                buttonStyle={{ backgroundColor: '#F54D30', marginBottom: 5}}
              />
            ))}
          </View>}
        </View>
        <FlatList
          ListEmptyComponent={<Text style={{ textAlign: 'center' }}>{this.state.loading ? '' :  'There is no result!'}</Text>}
          keyExtractor={(item, i) => i}
          data={this.state.data}
          ListFooterComponent={() => {
            return (
              this.state.loading ? (
                <View style={{ padding: 10 }}>
                  <ActivityIndicator size="large" color="#000" />
                </View>
              ) : null
            )
          }}
          renderItem={this.renderItem}
          onEndReached={this.fetchMoreUsers}
          onEndReachedThreshold={0.5}
        />
        <CategorySelector 
          visible={this.state.showCategorySelector} 
          onDone={(values) => this._onSelectCategoryDone(values)}
        />
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
    marginTop: 10,
    flexDirection: "row",
  },
  image: {
    height: 40,
    width: 64,
    marginLeft: 10,
  },
  text: {
    color: '#323232',
    width: 220
  },
});