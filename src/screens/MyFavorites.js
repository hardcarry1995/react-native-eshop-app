import React, {Component} from 'react'
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import client from '../constants/client';
import { GET_FAVORITES } from '../constants/queries';
import Toast from "react-native-toast-message";
import ProductCard from "../components/ProductCard";

class MyFavorites extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      fItems : [],
      offset : 0,
      userInfo : null,
      userToken : '',
      totalCount : 0
    }
  }

  componentDidMount() {
    this.fetchToken();
  }

  fetchToken = async () => {
    let token = await AsyncStorage.getItem('userToken');
    let userInfo = await AsyncStorage.getItem('userInfo');
    this.setState({
      userInfo: JSON.parse(userInfo),
      userToken: token,
    });
    this.fetchItems(token);
  }

  renderItem = ({ item, index }) => {
    return (
      <ProductCard  
        item={item}
        navigation={this.props.navigation}
        addToFavourites={(value) => console.log(value)}
        addToCart = {(value) => console.log(value)}
        key={index}
      />
    )
  }

  fetchItems = (token = null) => {  
    this.setState({ loading: true });
    client
      .query({
        query : GET_FAVORITES,
        context: {
          headers: {
            Authorization: `Bearer ${token === null ? this.state.userTokenData : token}`,
          },
        },
        variables: {
          size: this.state.offset
        },
      })
      .then(response => {
        const { count, result } = response.data.getMstFavouritesProductList;
        this.setState({ loading: false, totalCount: count, fItems : result  });
      })
      .catch(error => {
        this.setState({ loading: false });
        Toast.show({
          type: 'error', 
          text1: "Oop!",
          text2: "Something went wrong!"
        })
      })

  }

  render(){
    return (
      <View style={{ flex : 1}}>
        <View style={styles.statistics}>
          <Text style={{ fontSize: 16, fontWeight: '700' }}>My Favourites</Text>
          <Text>{`Total Items: ${this.state.fItems.length}` }</Text>
        </View>
        <View style={styles.container}>
          <FlatList
            ListFooterComponent={() => {
              return (
                this.state.loading ? (
                  <View style={{ padding: 10 }}>
                    <ActivityIndicator size="large" color="#000" />
                  </View>
                ) : null
              )
            }}
            keyExtractor={(item, i) => i}
            data={this.state.fItems}
            renderItem={this.renderItem}
            onEndReached={this.fetchItems}
            onEndReachedThreshold={0.5}
          />
        </View>
      </View>
      
    )
  }

  
}

export default MyFavorites

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  statistics: {
    height: 60,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    flexDirection: "row", 
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})