import React from 'react';
import { View, StyleSheet, Text, Image, SafeAreaView, TextInput, ToastAndroid, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import Colors from '../../constants/colors';
import { MAIN_CATEGORY, SUB_CATEGORY } from '../../constants/queries';
import client from '../../constants/client';
import AsyncStorage from '@react-native-community/async-storage';
import { Dimensions, Platform, PixelRatio } from 'react-native';
import { imagePrefix } from '../../constants/utils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 320;

export default class Feed extends React.Component {

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

  actuatedNormalize(size) {
    const newSize = size * scale
    if (Platform.OS === 'ios') {
      return Math.round(PixelRatio.roundToNearestPixel(newSize))
    } else {
      return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
    }
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
            // 'Content-Length': 0,
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
    this.setState({ loading: 'sub' });
    this.setState({ categoryId: id });
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
        console.log(err);
      });
  }

  renderChat = ({ item, index }) => (
    <TouchableOpacity
      onPress={() =>
        this.props.navigation.navigate('SingleChat', {
          title: item.name,
        })
      }
      style={{ flex: 1, padding: 15, flexDirection: 'row' }}
      key={index}>
      <Image
        style={styles.avatar}
        source={require('../../assets/images/admin.jpg')}
      />
      <View style={{ flex: 1, marginLeft: 15, justifyContent: 'center' }}>
        <View style={styles.row1}>
          <Text style={styles.nameText}>{item.name}</Text>
          <Text style={[styles.dateText, font_style.font_Book]}>
            {item.date_string}
          </Text>
        </View>
        <View style={styles.row2}>
          <Text
            style={[styles.textStyle, font_style.font_Book]}
            numberOfLines={3}>
            {item.text}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  renderSeparator = () => (
    <View
      style={{
        backgroundColor: '#ccc',
        width: '90%',
        height: 1,
        alignSelf: 'center',
        marginLeft: 15,
        marginRight: 15,
      }}
    />
  );

  render() {
    return (
      <View style={{ flex: 1 }}>
        <SafeAreaView>
          <View
            style={{
              height: 80,
              backgroundColor: '#E8474B',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View style={styles.SectionStyle}>
              <Image
                source={require('../../assets/search.png')}
                style={styles.ImageStyle}
              />

              <TextInput
                style={{ flex: 1 }}
                placeholder="Search Products"
                underlineColorAndroid="transparent"
              />
            </View>
          </View>
          <View
            style={{
              height: 60,
              flexDirection: 'row',
              alignItems: 'center',
              padding: 15,
            }}>
            <Text
              style={{ fontSize: 16, color: '#323232', marginHorizontal: '3%' }}>
              Category
            </Text>
            <Text
              style={{ color: '#323232', fontSize: 9, marginHorizontal: '20%' }}>
              SEE ALL PRODUCTS
            </Text>
            <Image
              style={{ height: 15, width: 10, }}
              source={require('../../assets/C19_1.png')}
            />
          </View>

          <View style={{ flexDirection: 'row' }}>
            <View
              style={{
                width: '30%',
                flex: 1,
                flexDirection: 'column',
              }}>
              {this.state.data.map((item, i) => {
                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => {
                      this.fetchSubCategory(item.categoryId);
                      this.setState({ sub: [] });
                      this.setState({ catIcon: item.categoryIcon })
                    }}>
                    <Text
                      style={{
                        fontSize: this.actuatedNormalize(14),
                        color: '#323232',
                        padding: 10,
                        marginHorizontal: '2%',
                      }}>
                      {item.categoryName}
                    </Text>
                  </TouchableOpacity>
                );
              })}

            </View>
            <View style={{ width: '65%', marginTop: 5 }}>
              <Text style={{ color: '#323232', fontSize: 12, padding: 5 }}>
                SubCategory
              </Text>
              <View
                style={{
                  height: 1,
                  backgroundColor: 'white',
                  width: '100%',
                  marginTop: 5,
                }}
              />
              {this.state.loading === 'sub' && (
                <ActivityIndicator color="#000" size="large" />
              )}
              <ScrollView style={{ height: '72%', width: '95%', alignSelf: 'center', paddingBottom: 10 }}>
                {this.state.sub.map((item, i) => {
                  return (
                    <TouchableOpacity
                      key={i}
                      style={{ marginVertical: 10 }}
                      onPress={() => {
                        this.props.navigation.navigate('Categories20', {
                          categoryId: this.state.categoryId,
                          subCategoryId: item.categoryId,
                          subCategoryName: item.categoryName
                        });
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                        <Image
                          style={{
                            height: 25,
                            width: 25,
                            alignContent: 'center',
                            marginLeft: 10,
                            marginRight: 10
                          }}
                          source={item.categoryIcon
                            ?
                            { uri: `${imagePrefix}${item.categoryIcon}` }
                            :
                            { uri: `${imagePrefix}${this.state.catIcon}` }}
                        />
                        <Text style={{ textAlign: 'center', fontSize: this.actuatedNormalize(12), marginTop: 2 }}>
                          {item.categoryName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </SafeAreaView>
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
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  row1: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  row2: {
    marginBottom: 7,
    marginRight: 20,
  },
  row3: {},
  nameText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'futura-bold',
    color: Colors.secondColor,
  },
  dateText: {
    fontSize: 15,
  },
  textStyle: {
    color: Colors.dark_gray,
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
});
