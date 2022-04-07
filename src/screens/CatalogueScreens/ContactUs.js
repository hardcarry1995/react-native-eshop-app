import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { GET_ALL_MAGAZINE_LIST } from '../../constants/queries';
import client from '../../constants/client';
import Moment from 'moment';
import { Rating, Chip } from "react-native-elements";
import ProductSearchInput from "../../components/ProductSearchInput";
import CategorySelector from "../../components/CategorySelector";

export default class FaqScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      offset: 10,
      cartLoading: false,
      data: [],
      setAllcartcount: [],
      userInfo: [],
      userTokenData: '',
      textnew: "",
      categories: [],
      showCategorySelector : false
    };
  }

  componentDidMount() {
    this.fetchToken();
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
    let userInfo = await AsyncStorage.getItem('userInfo');
    this.setState({
      userInfo: JSON.parse(userInfo),
      userTokenData: token
    });
    this.getShoppingCart(token);
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
          size: this.state.offset,
          name: this.state.textnew === "" ? null : this.state.textnew,
          categories : this.state.categories.length === 0 ? null : this.state.categories.join(",")
        },
      })
      .then(result => {
        this.setState({ cartLoading: false });
        this.setState({ data: result.data.getMagazinesList.result })
        this.setState({ setAllcartcount: result.data.getMagazinesList.result })
        console.log("Single Item:", result.data.getMagazinesList.result[0])

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
            name: this.state.textnew == "" ? null : this.state.textnew,
            categories : this.state.categories.length == 0 ? null : this.state.categories.join(",")
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

  renderItem = ({ item, index }) => (
    <TouchableOpacity 
      key={index}
      onPress={() => { this.props.navigation.navigate('CatalogueNew', { detail: item }); }}
      activeOpacity={0.9}
    >
      <View style={styles.main}>
        <View style={{ borderRightWidth: 1, borderRightColor : "#c8c8c8"}}>
          <Image
            style={styles.image}
            source={item.itemImagePath ? { uri: `${imagePrefix}${item.mapEflyersUploadDtos[0].documentName}` } : require('../../assets/NoImage.jpeg')}
          />
        </View>
        <View style={{ paddingLeft : 20}}>
          <Text style={styles.text} numberOfLines={1}>{item.magazineName}</Text>
          <Rating  imageSize={16} readonly startingValue={5} style={{ alignItems: 'flex-start'}} />
          <Text style={{ color: '#A8A8A8', fontSize: 11, marginVertical: 5 }}>
            {Moment(item.startDate).format('DD-MMM-YYYY')}
          </Text>
          <Text  numberOfLines={1} style={{ color: '#323232', fontSize: 11, width: 260 }}>
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
          <FlatList
            ListEmptyComponent={<Text style={{ textAlign: 'center' }}>{this.state.cartLoading ? '' :  'There is no result!'}</Text>}
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
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  image: {
    height: 64,
    width: 64,
    marginLeft: 10,
  },
  text: {
    color: '#323232',
    marginBottom : 5
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
