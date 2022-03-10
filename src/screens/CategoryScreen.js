import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, SafeAreaView, TextInput, ToastAndroid, ActivityIndicator, ScrollView, TouchableOpacity, Dimensions, Platform, PixelRatio } from 'react-native';
import Colors from '../constants/colors';
import { MAIN_CATEGORY, SUB_CATEGORY } from '../constants/queries';
import client from '../constants/client';
import AsyncStorage from '@react-native-community/async-storage';
import { imagePrefix } from '../constants/utils';
import Constants from "../constants/constant"

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// based on iphone 5s's scale
const scale = SCREEN_WIDTH / 320;

function actuatedNormalize(size) {
  const newSize = size * scale
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  }
}

export default class CategoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: '',
      sub: [],
      subCategoryId: '',
      categoryId: '',
      catIcon: ''
    };
  }

  componentDidMount() {
    this.fetchMainCategory();
  }


  async fetchMainCategory() {
    let token = await AsyncStorage.getItem('userToken');
    this.setState({ loading: 'main' });
    client
      .query({
        query: MAIN_CATEGORY,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      })
      .then(async result => {
        this.setState({ loading: '' });
        if (result.data.getMstCategoryMain.success) {
          console.log(result.data.getMstCategoryMain.result);
          this.setState({ data: result.data.getMstCategoryMain.result });
          this.setState({ catIcon: result.data.getMstCategoryMain.result[0].categoryIcon });
          this.fetchSubCategory(result.data.getMstCategoryMain.result[0].categoryId);
        } else {
          ToastAndroid.show(
            result.data.getMstCategoryMain.message,
            ToastAndroid.SHORT,
          );
        }
      })
      .catch(err => {
        this.setState({ loading: '' });
        console.log(err);
      });
  }

  async fetchSubCategory(id) {
    let token = await AsyncStorage.getItem('userToken');
    this.setState({ loading: 'sub', categoryId: id });
    client
      .query({
        query: SUB_CATEGORY,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        variables: {
          id: id,
        },
      })
      .then(async result => {
        this.setState({ loading: '' });
        if (result.data.getMstCategoryByParentId.success) {
          this.setState({ sub: result.data.getMstCategoryByParentId.result });
        } else {
          ToastAndroid.show(
            result.data.getMstCategoryByParentId.message,
            ToastAndroid.SHORT,
          );
        }
      })
      .catch(err => {
        this.setState({ loading: '' });
      });
  }

  _onPressCategory = (item) => {
    this.fetchSubCategory(item.categoryId);
    this.setState({ sub: [] });
    this.setState({ catIcon: item.categoryIcon })
  }

  _renderCategories = () => {
    const categories = this.state.data.map((item, i) => {
      return (
        <TouchableOpacity key={i} onPress={() => this._onPressCategory(item)} style={this.state.categoryId == item.categoryId ? styles.selectedCategory : null}>
          <Text style={styles.mainCategoryTitle}>
            {item.categoryName}
          </Text>
        </TouchableOpacity>
      );
    });
    return categories;
  }

  _onPressSubCategory = (item) => {
    this.props.navigation.navigate({
      name: 'HomeWithParam', params: {
        categoryId: this.state.categoryId,
        subCategoryId: item.categoryId,
        subCategoryName: item.categoryName
      }
    });
  }

  _renderSubCategory = () => {
    const subCategories = this.state.sub.map((item, i) => {
      return (
        <TouchableOpacity key={i} onPress={() => this._onPressSubCategory(item)}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
            <Image
              style={styles.subcategoryImage}
              source={{ uri: item.categoryIcon ? `${imagePrefix}${item.categoryIcon}` : `${imagePrefix}${this.state.catIcon}` }}
            />
            <Text style={styles.subcategory}>{item.categoryName}</Text>
          </View>
        </TouchableOpacity>
      );
    });

    return subCategories;
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.searchContainer}>
          <View style={styles.SectionStyle}>
            <Image source={require('../assets/search.png')} style={styles.ImageStyle} />
            <TextInput style={{ flex: 1 }} placeholder="Search Products" underlineColorAndroid="transparent" />
          </View>
        </View>
        <View style={styles.subtitleSection}>
          <Text style={{ fontSize: 16, color: '#323232', marginHorizontal: '3%' }}>
            Category
          </Text>
          <Text style={{ color: '#323232', fontSize: 12, marginHorizontal: '20%' }}>
            SEE ALL PRODUCTS
          </Text>
          <Image style={{ height: 15, width: 10 }} source={require('../assets/C19_1.png')} />
        </View>

        <View style={{ flexDirection: 'row' }}>
          <View style={{ paddingHorizontal: 10 }}>
            {this._renderCategories()}
          </View>
          <View style={styles.subcategoryContainer}>
            <Text style={styles.subcategoryTitle}>SubCategory</Text>
            <View style={styles.divider} />
            {this.state.loading === 'sub' && (
              <ActivityIndicator color="#000" size="large" />
            )}
            <ScrollView style={styles.subcategoryContentContainer}>
              {this._renderSubCategory()}
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: Colors.bg_color,
  },
  searchContainer: {
    height: 80,
    backgroundColor: '#E8474B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCategory: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.tintColor
  },
  subtitleSection: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  subcategoryContainer: {
    width: '68%',
    marginTop: 20
  },
  subcategoryTitle: {
    color: '#323232',
    fontSize: 12,
    padding: 5
  },
  divider: {
    height: 1,
    backgroundColor: 'lightgrey',
    width: '100%',
    marginTop: 5,
  },
  subcategoryContentContainer: {
    height: '72%',
    paddingBottom: 10,
    paddingRight: 10
  },
  subcategoryImage: {
    height: 25,
    width: 25,
    marginLeft: 10,
    marginRight: 10
  },
  subcategory: {
    fontSize: actuatedNormalize(12),
    width: 200
  },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#F54D30',
    height: '55%',
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
  mainCategoryTitle: {
    fontSize: actuatedNormalize(14),
    color: '#323232',
    padding: 10,
    marginHorizontal: '2%',
  }
});
