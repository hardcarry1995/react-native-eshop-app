import React from 'react';
import { Alert, Image, View, Text } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger, renderers } from 'react-native-popup-menu';
import { BASE_URL } from './API_baseURL';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-root-toast';

const { Popover } = renderers;

export default class PopUpMenu extends React.Component {
  createTwoButtonAlert = feed_id => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete Post?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => this.deleteFeed(feed_id) },
      ],
      { cancelable: false },
    );
  };
  deleteFeed = async feed_id => {
    console.log(feed_id);
    this.setState({ isLoading: true });
    let params = { feed_id: feed_id, delete_me: feed_id };
    console.log('f', this.state.feed_id);
    var user_token = await AsyncStorage.getItem('user_token');
    return fetch(BASE_URL + 'user/view-delete/feed', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + user_token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ isLoading: false });
        console.log('response', responseJson.message);
        if (responseJson.status == true) {
          // this.showToast('Feed Add Succefully')

          console.log(responseJson.message);
          this.props.navigation.navigate('Feed');
        }
        if (responseJson.code === 300) {
          Toast.show(responseJson.message, {
            shadow: true,
            animation: true,
            duration: Toast.durations.SHORT,
            opacity: 0.8,
            position: Toast.positions.BOTTOM,
          });
        } else {
          this.props.navigation.navigate('Feed');

          this.setState({ isLoading: false });
        }
      })
      .catch(error => {
        this.setState({ isLoading: false });
        console.error(error);
      });
  };
  render() {
    return (
      <Menu
        renderer={Popover}
        rendererProps={{
          placement: 'bottom',
          preferredPlacement: 'bottom',
          anchorStyle: { backgroundColor: 'white' },
        }}>
        <MenuTrigger
          style={{ padding: 15 }}
          customStyles={{
            triggerTouchable: { activeOpacity: 1, underlayColor: 'transparent' },
          }}>
          <Image
            style={{ width: 30, height: 4, resizeMode: 'contain' }}
            source={require('../assets/images/3dot.png')}
          />
        </MenuTrigger>

        <MenuOptions
          customStyles={{
            optionWrapper: { justifyContent: 'space-between' },
            optionText: { fontSize: 18 },
          }}
          optionsContainerStyle={{ backgroundColor: 'transparent' }}
          style={{ padding: 5, borderRadius: 10, backgroundColor: '#ffffffEE' }}>
          <MenuOption
            onSelect={() => {
              this.props.navigation.navigate('EditFeed', {
                ImageUlr: this.props.img,
                content: this.props.text,
              });
            }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: 70 }}>
                <Text style={{ fontSize: 16 }}>Edit</Text>
              </View>
              <Image
                style={{
                  width: 20,
                  height: 15,
                  resizeMode: 'contain',
                  marginTop: 3,
                }}
                source={require('../assets/images/pencil-3x.png')}
              />
            </View>
          </MenuOption>
          <MenuOption
            onSelect={() => {
              this.createTwoButtonAlert(this.props.feed_id);
            }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: 70 }}>
                <Text style={{ fontSize: 16 }}>Delete</Text>
              </View>
              <Image
                style={{
                  width: 20,
                  height: 15,
                  resizeMode: 'contain',
                  marginTop: 3,
                }}
                source={require('../assets/images/Delete_3x.png')}
              />
            </View>
          </MenuOption>
        </MenuOptions>
      </Menu>
    );
  }
}
