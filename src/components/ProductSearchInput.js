import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'

const ProductSearchInput = ({ onChangeText, onPressFilterIcon }) => {

  onChangeSearchKey = (queryText) => {
    onChangeText(queryText)
  }

  return (
    <View style={styles.container}>
      <Image source={require('../assets/search.png')} style={styles.searchIcon} />
      <TextInput
        style={{ flex: 1 }}
        placeholder="Search Products"
        underlineColorAndroid="transparent"
        onChangeText={onChangeSearchKey}
      />
      <TouchableOpacity onPress={onPressFilterIcon} >
        <Image source={require('../assets/Group28.png')} style={styles.filterIcon} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: 'lightgray',
    borderRadius: 10,
    margin: 15,
  },
  searchIcon: {
    padding: 10,
    margin: 5,
    height: 20,
    width: 20,
    resizeMode: 'stretch',
    alignItems: 'center',
  },
  filterIcon: {
    padding: 10,
    margin: 15,
    height: 20,
    width: 20,
    resizeMode: 'stretch',
    alignItems: 'center',
  }
})

export default ProductSearchInput