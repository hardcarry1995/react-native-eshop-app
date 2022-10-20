import React from 'react';
import { StyleSheet, Text, View, Dimensions, SafeAreaView, Image, ToastAndroid, ActivityIndicator, ScrollView, TouchableOpacity, Platform, PixelRatio } from 'react-native'
import Modal from "react-native-modal";
import { MAIN_CATEGORY, SUB_CATEGORY } from '../constants/queries';
import client from '../constants/client';
import AsyncStorage from '@react-native-community/async-storage';
import { imagePrefix } from '../constants/utils';
import Colors from '../constants/colors';
import { Chip } from "react-native-elements";
import categories, { mainCategoryId } from "../constants/categories";

const { height } = Dimensions.get('window');
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const scale = SCREEN_WIDTH / 320;

function actuatedNormalize(size) {
  const newSize = size * scale
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  }
}

const mainCategoryIndex = categories.findIndex((category) => category.categoryId === mainCategoryId); // 0 - 5

export default class CategorySelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: '',
      sub: [],
      subCategoryId: '',
      categoryId: categories[mainCategoryIndex].categoryId,
      catIcon: categories[mainCategoryIndex].categoryIcon,
      selectedCategories : []
    };

    this.maxCount = this.props.multiple ? 10 : 1;
  }

  componentDidMount() {
    this.fetchSubCategory(this.state.categoryId);
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
    if(this.state.selectedCategories.length == this.maxCount) {
      alert(`You can select up to ${this.maxCount} categories`);
      return;
    }
    if(this.state.selectedCategories.findIndex((cat) => cat.categoryId === item.categoryId ) > -1) return;
    if(this.props.multiple){
      const items = [...this.state.selectedCategories, item];
      this.setState({ selectedCategories: items });
    } else {
      this.setState({ selectedCategories: [item]});
      this.props.onDone([item]);
    }
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

  _renderSelectedCategories = () => {
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10}}>
        {this.state.selectedCategories.map(item => (
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
            key={item.categoryId}
          />
        ))}
      </View>
    )
  }

  _onPressSelectedCategory = (item) => {
    const items = this.state.selectedCategories.filter((cat) => cat.categoryId != item.categoryId);
    this.setState({ selectedCategories: items});
  }

  _onPressDone = () => {
    const { onDone } = this.props;
    onDone(this.state.selectedCategories);
  }

  render() {
    return (
      <Modal
        isVisible={this.props.visible}
        style={styles.view}
        onModalWillShow={() => this.fetchSubCategory(this.state.categoryId)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 10, marginTop: 10}}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}> Select categories - {categories[mainCategoryIndex].categoryName}</Text>
          </View>
          <ScrollView horizontal={false} contentContainerStyle={{ flex : 1, width : SCREEN_WIDTH}} style={{ width: "100%"}}>
            {this._renderSelectedCategories()}
            <View style={{ flexDirection: 'row', width: "100%"}}>
              <View style={{ paddingHorizontal: 10 }}>
                {this._renderCategories()}
              </View>
              <View style={styles.subcategoryContainer}>
                <Text style={styles.subcategoryTitle}></Text>
                <View style={styles.divider} />
                {this.state.loading === 'sub' && (
                  <ActivityIndicator color="#000" size="large" />
                )}
                <ScrollView style={styles.subcategoryContentContainer}>
                  {this._renderSubCategory()}
                </ScrollView>
              </View>
            </View>
          </ScrollView>
          <TouchableOpacity style={styles.doneButton} onPress={this._onPressDone}>
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    );
  }
}

CategorySelector.defaultProps = {
  visible: false,
  multiple: true,
  onDone: (categories) => {}
}

const styles = StyleSheet.create({
  modalContainer : {
    backgroundColor: 'white',
    paddingTop: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    height: height,
    paddingHorizontal: 10,
    width: "100%"
  },
  view: {
    justifyContent: 'flex-end',
    margin: 0,
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
    paddingBottom: 30
  },
  subcategoryTitle: {
    color: '#323232',
    fontSize: 12,
    padding: 5
  },
  divider: {
    height: 1,
    backgroundColor: 'lightgrey',
    width: SCREEN_WIDTH - 40,
    marginTop: 5,
  },
  subcategoryContentContainer: {
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
  },
  doneButton : {
    width : 120, 
    height : 40,
    backgroundColor: "#F54D30",
    justifyContent : 'center',
    alignItems : 'center',
    borderRadius : 10,
    marginVertical: 10,
  },
  doneText : {
    color: "#fff",
    fontSize: 14, 
    fontWeight: '600'
  }
})