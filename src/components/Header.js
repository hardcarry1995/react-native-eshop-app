import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';

const Header = () => {
  return (
    <View style={{height: '10%', flexDirection: 'row', elevation: 9}}>
      <TouchableOpacity>
        <Image
          style={{ height: 25, width: 15, alignItems: 'flex-start', margin: 15, marginTop: 35 }}
          source={require('./../assets/left-arrow.png')}
        />
      </TouchableOpacity>
      <View style={{justifyContent: 'center', padding: 10}}>
        <Text
          style={{ color: 'black', fontSize: 25, marginTop: 25, fontWeight: '500' }}>
          SING UP
        </Text>
      </View>
    </View>
  );
};

export default Header;
