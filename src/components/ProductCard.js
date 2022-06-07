import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { imagePrefix } from '../constants/utils';
import { Rating } from 'react-native-elements';

const ProductCard = ({ item, navigation, addToFavourites, addToCart }) => {
  const onPressItem = () => {
    navigation.navigate('Filter', { data: item });
  }

  onPressFavourite = () => {
    addToFavourites(item.productID)
  }

  onPressCart = () => {
    addToCart(item.productID)
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPressItem} style={styles.productItemContainer}>
        <Image style={styles.productImage} source={item.productImage ? { uri: `${imagePrefix}${item.productImage}` } : require('../assets/NoImage.jpeg')} />
        <View style={styles.productDetailContainer}>
          <View style={styles.productDetail}>
            <Text numberOfLines={1} style={styles.productTitle}>
              {item.productName}
            </Text>
            <View style={{ flexDirection: "row", padding: 1, paddingBottom: 5 }}>
              <Rating imageSize={12} readonly startingValue={item.ratingScore} />
            </View>
            <Text style={styles.price}>
              R {item.unitCost.toFixed(2)}
            </Text>
            <Text numberOfLines={2} style={{ color: '#BBB' }}>
              {item.description}
            </Text>
          </View>
          <View style={styles.actionsContainer}>
            <TouchableOpacity onPress={onPressFavourite} >
              <Image style={styles.heartIcon} source={require('../assets/heart.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onPressCart} >
              <Image style={styles.cartIcon} source={require('../assets/shopping.png')} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 15,
    // elevation: 5,
  },
  productItemContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productImage: {
    height: 100,
    width: 100,
    padding: 5,
    marginVertical: 5,
    alignSelf: 'center'
  },
  productDetailContainer: {
    flex: 1,
    borderColor: '#eeeeee',
    borderRadius: 15,
    borderWidth: 1,
  },
  starImageStyle: {
    width: 12,
    height: 12,
    marginRight: 2
  },
  productDetail: {
    flexDirection: 'column',
    marginLeft: 10,
    margin: 10
  },
  productTitle: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold'
  },
  price: {
    fontSize: 10,
    color: '#9f1d20',
    fontWeight: 'bold',
    marginTop: -17,
    alignSelf: 'flex-end',
  },
  actionsContainer: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    padding: 5,
  },
  heartIcon: {
    height: 25,
    width: 25,
    tintColor: '#bbb'
  },
  cartIcon: {
    height: 25,
    width: 25,
    tintColor: '#DB3236'
  }
})

export default ProductCard