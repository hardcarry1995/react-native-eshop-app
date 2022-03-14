import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { imagePrefix } from "../../constants/utils";

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
    };
  }

  componentDidMount() {
    this.getUserInfo();
  }

  async getUserInfo() {
    let info = await AsyncStorage.getItem('userInfo');
    const infoUser = JSON.parse(info);
    console.log('userInfo', infoUser);
    this.setState({
      userInfo: infoUser,
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <View
          style={{
            backgroundColor: '#DB3236',
            height: '100%',
            flex: 1,
            marginTop: 5,
          }}>
          <View style={styles.main}>
            <View>
              <Text
                style={{
                  left: 20,
                  marginTop: 20,
                  fontWeight: 'bold',
                  fontSize: 25,
                  color: '#9F1D20',
                }}>
                {this.state.userInfo.firstName} {this.state.userInfo.lastName}
              </Text>
              <Text style={styles.sub}>Gender</Text>
              <Text style={styles.text}>{this.state.userInfo.vGender}</Text>
              <Text style={styles.sub}>Date of Birth</Text>
              <Text style={styles.text}>3 / 11 / 1997</Text>
              <Text style={styles.sub}>Account Info</Text>
              <Text style={styles.text}>{this.state.userInfo.email}</Text>
              <Text style={styles.sub}>Address Info</Text>
              <Text style={styles.text}>
                {this.state.userInfo.streetAddress}
              </Text>
              <Text style={styles.text}>
              </Text>
              <Text style={styles.text}>
              </Text>
              <Image
                style={{
                  height: 180,
                  width: 180,
                  marginTop: -470,
                  marginLeft: 150,
                }}
                source={this.state.userInfo.userProfileImage
                  ?
                  { uri: `${imagePrefix}${this.state.userInfo.userProfileImage}` }
                  :
                  require('../../assets/images/admin.jpg')}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  main: {
    height: '70%',
    width: '88%',
    backgroundColor: 'white',
    borderRadius: 35,
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 2,
    paddingRight: 2,
    marginTop: '35%',
    marginBottom: 6,
    marginLeft: 16,
    marginRight: 16,
  },
  sub: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#9F1D20',
    padding: 10,
  },
  text: {
    fontSize: 17,
    color: '#232323',
    opacity: 0.5,
    marginLeft: 10,
  },
  header: {
    color: '#fff',
    //fontFamily: 'FuturaPTMedium',
    fontSize: 20,
    textAlign: 'center',
    //width: '100%'
  },
  header_style: {
    height: Platform.OS === 'ios' ? 85 : 68,
  },
  leftIcon: {
    justifyContent: 'center',
    paddingLeft: 20,
    width: 48,
    height: 48,
  },
  rightIcon: {
    justifyContent: 'center',
    paddingRight: 20,
    width: 48,
    height: 48,
  },
});
