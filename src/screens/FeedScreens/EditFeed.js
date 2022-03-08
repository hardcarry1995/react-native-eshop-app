import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';
import { BASE_URL } from '../API_baseURL';
import AsyncStorage from '@react-native-community/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
const { Popover } = renderers;

export default class EditFeed extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user_image: '',
      feed_content: this.props.navigation.getParam('content'),
      user_image: this.props.navigation.getParam('ImageUlr'),
      id: this.props.navigation.getParam('id'),
    };
  }
  addFeed = async () => {
    console.log('image data', this.state.user_image);
    // alert('j')
    this.setState({ isLoading: true });
    var data = new FormData();
    data.append('feed_img_video', this.state.user_image);
    data.append('feed_content', this.state.feed_content);
    //   let params = { feed_img_video:this.state.user_image, feed_content: this.state.feed_content };
    //  console.log('data--',data)

    var user_token = await AsyncStorage.getItem('user_token');
    return fetch(BASE_URL + 'user/add-update/feed', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + user_token,
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ isLoading: false });
        console.log(responseJson.message);
        if (responseJson.status === true) {
          this.showToast('Feed Add Succefully');
          // alert('f')
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
          this.setState({ isLoading: false });
        }
      })
      .catch(error => {
        this.setState({ isLoading: false });
        console.error(error);
      });
  };

  Pick_Image = () => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
    }).then(image => {
      console.log('imageData', image);

      var imageData = {
        name: image.path.substring(image.path.lastIndexOf('/') + 1),
        type: image.mime,
        uri:
          Platform.OS === 'android'
            ? image.path
            : image.path.replace('file://', ''),
      };
      console.log('imageData--imageData', imageData);
      this.setState({
        user_image: imageData.uri,
        ImgData: imageData,
      });
    });
  };

  captureImage = () => {
    ImagePicker.openCamera({
      width: 400,
      height: 400,
      cropping: true,
    }).then(image => {
      console.log('imageData', image);

      var imageData = {
        name: image.path.substring(image.path.lastIndexOf('/') + 1),
        type: image.mime,
        uri:
          Platform.OS === 'android'
            ? image.path
            : image.path.replace('file://', ''),
      };
      console.log('imageData--imageData', imageData);
      this.setState({
        user_image: imageData.uri,
        ImgData: imageData,
      });
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <Menu
            renderer={Popover}
            rendererProps={{
              placement: 'bottam',
              preferredPlacement: 'bottam',
              anchorStyle: { backgroundColor: 'transparent' },
            }}>
            <MenuTrigger
              style={{}}
              customStyles={{
                triggerTouchable: {
                  activeOpacity: 1,
                  underlayColor: 'transparent',
                },
              }}>
              <View style={{ alignItems: 'center' }}>
                {this.state.user_image ? (
                  <View style={styles.dashedStyle1}>
                    <Image
                      style={{ width: '100%', height: 180, borderRadius: 10 }}
                      source={{ uri: this.state.user_image }}
                    />
                  </View>
                ) : (
                  <View style={styles.dashedStyle}>
                    <View
                      style={{ alignItems: 'center', justifyContent: 'center' }}>
                      <Image
                        style={{ width: 100, height: 100 }}
                        source={require('../../assets/images/Photos2x.png')}
                      />
                      <Text style={{ color: '#C3C3C4', fontSize: 16 }}>
                        Add Photo / Video
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </MenuTrigger>

            <MenuOptions
              customStyles={{
                optionWrapper: { justifyContent: 'space-between' },
                optionText: { fontSize: 18 },
              }}
              optionsContainerStyle={{ backgroundColor: 'transparent' }}
              style={{
                padding: 5,
                borderRadius: 10,
                backgroundColor: '#ffffffEE',
              }}>
              <MenuOption
                onSelect={() => {
                  this.captureImage();
                }}
                text="Take Picture"
              />
              <MenuOption
                onSelect={() => {
                  this.Pick_Image();
                }}
                text="Pick from Gallery"
              />
            </MenuOptions>
          </Menu>

          <View style={{ marginTop: 15 }}>
            <TextInput
              placeholder="What is on your mind?"
              onChangeText={feed_content => this.setState({ feed_content })}
              value={this.state.feed_content}
              multiline={true}
              style={{
                textAlignVertical: 'top',
                padding: 10,
                color: '#C3C3C4',
                fontSize: 18,
                height: 100,
              }}
            />
          </View>

          <View style={{ justifyContent: 'flex-end', flex: 1, marginBottom: 10 }}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('Feed');
              }}
              style={styles.button}
              underlayColor="gray"
              activeOpacity={0.6}>
              <Text
                style={[
                  buttonStyle.loginText,
                  { color: '#ACACAD', fontWeight: 'bold' },
                ]}>
                Save Post
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F6F6F8',
  },
  dashedStyle: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    padding: 25,
  },
  dashedStyle1: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#E2E4E6',
    borderRadius: 50,
    justifyContent: 'center',
    width: '100%',
    height: 46,
  },
});
