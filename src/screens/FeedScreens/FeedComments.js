import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  RefreshControl,
  Keyboard,
  Modal,
} from 'react-native';
import Colors from '../../constants/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { BottomSheet } from 'react-native-btr';
import { BASE_URL } from '../API_baseURL';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../components/loader';
import Toast from 'react-native-root-toast';

export default class FeedComments extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      id: this.props.navigation.getParam('id'),
      comment: '',
      replycomment: '',
      Like: false,
      checked: [],
      CommentData: [],
      replyCommentData: [],
      comment_id: '',
      data: [
        {
          name: 'Davidaaaa',
          date: 'Just Now',
          image:
            'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
          message:
            'Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet',
        },
        {
          name: 'Rachel',
          date: '05 Feb | 07:07 AM',
          image:
            'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
          message:
            'Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet',
        },
        {
          name: 'Mike',
          date: '08 Feb | 07:07 AM',
          image:
            'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
          message: 'Lorem ipsum dolor sit a met Lorem ipsum dolor sit amet',
        },
        {
          name: 'Lucy',
          date: '15 Feb | 07:07 AM',
          image:
            'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
          message: 'Lorem ipsum dolor sit a met Lorem ipsum dolor sit amet',
        },
        {
          name: 'Stay',
          date: '25 Feb | 07:07 AM',
          image:
            'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
          message:
            'Lorem ipsum dolor sit a metLorem ipsum dolor sit a met Lorem ipsum dolor sit ametLorem ipsum dolor sit amet',
        },
        {
          name: 'Liyona',
          date: '05 Feb | 07:07 AM',
          image:
            'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
          message: 'Lorem ipsum dolor sit a met Lorem ipsum dolor sit amet',
        },
        {
          name: 'Rachel',
          date: '18 Feb | 07:07 AM',
          image:
            'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
          message:
            'Lorem ipsum dolor sit a metLorem ipsum dolor sit a met Lorem ipsum dolor sit ametLorem ipsum dolor sit amet',
        },
        {
          name: 'David',
          date: '05 Feb | 07:07 AM',
          image:
            'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
          message:
            'Lorem ipsum dolor sit a met Lorem ipsum dolor sit ametLorem ipsum dolor sit amet',
        },
        {
          name: 'Mike',
          date: '22 Feb | 07:07 AM',
          image:
            'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
          message:
            'Lorem ipsum dolor sit a metLorem ipsum dolor sit a met Lorem ipsum dolor sit ametLorem ipsum dolor sit amet',
        },
      ],
    };
  }

  showToast = msg => {
    if (this.toast) Toast.hide(this.toast);
    this.toast = Toast.show(msg, {
      duration: 1500,
      position: Toast.positions.BOTTOM,
      backgroundColor: '#000',
      textColor: '#FFF',
    });
  };
  componentWillMount() {
    this.getListComment();
  }
  getReplayListComment = async comment_id => {
    this.setState({ isLoading: true });
    let params = { comment_id: comment_id };
    // console.log('f',this.state.id)
    var user_token = await AsyncStorage.getItem('user_token');
    return fetch(BASE_URL + 'allthread/on/specific-comment', {
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
        // console.log(responseJson.message)
        if (responseJson.status === true) {
          // this.showToast('Feed Add Succefully')
          // alert('f')
          this.setState({ replyCommentData: responseJson.message });
          console.log(this.state.CommentData);
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
  getListComment = async () => {
    this.setState({ isLoading: true });
    let params = { feed_id: this.state.id };
    // console.log('f',this.state.id)
    // alert(this.state.id)
    var user_token = await AsyncStorage.getItem('user_token');
    return fetch(BASE_URL + 'allcomments/on/specific-feed', {
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
        // console.log(responseJson.message)
        if (responseJson.status === true) {
          // this.showToast('Feed Add Succefully')
          // alert('f')
          this.setState({ CommentData: responseJson.message });
          // console.log(this.state.CommentData)
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
  addComment = async () => {
    this.setState({ isLoading: true });
    let params = { comment: this.state.comment, feed_id: this.state.id };
    // console.log('f',this.state.id)
    var user_token = await AsyncStorage.getItem('user_token');
    return fetch(BASE_URL + 'user/add/comment-to/feed', {
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
        // console.log(responseJson.message)
        if (responseJson.status === true) {
          // this.showToast('Feed Add Succefully')
          // alert('f')
          Keyboard.dismiss();
          this.getListComment();
          this.setState({ comment: '' });
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

  replayComment = async () => {
    this.setState({ isLoading: true });
    let params = {
      comment: this.state.replycomment,
      comment_id: this.state.comment_id,
    };
    // console.log('f',this.state.id)
    var user_token = await AsyncStorage.getItem('user_token');
    return fetch(BASE_URL + 'add-update/threadcomment', {
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
        // console.log(responseJson.message)
        if (responseJson.status === true) {
          // this.showToast('Feed Add Succefully')
          // alert('f')
          Keyboard.dismiss();
          this.getListComment();
          this.setState({ comment: '' });
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

  add_LikeOnComment = async id => {
    this.setState({ isLoading: true });
    let params = { comment_id: id, type_of_comment: id };

    // console.log('f',this.state.id)
    var user_token = await AsyncStorage.getItem('user_token');
    return fetch(BASE_URL + 'add/likes/on/comment', {
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
        console.log(responseJson.message);
        if (responseJson.status === true) {
          // this.showToast('Feed Add Succefully')
          // alert('f')
          console.log(responseJson.message);
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

  _toggleBottomNavigationView = id => {
    //Toggling the visibility state of the bottom sheet
    this.setState({ visible: !this.state.visible });
    // alert('t')
    this.setState({ comment_id: id });
    this.getReplayListComment(id);
  };

  handleChange = (index, id) => {
    let { checked } = this.state;
    checked[index] = !checked[index];
    this.setState({ checked });
    this.add_LikeOnComment(id);
  };

  CommentrenderItem = ({ item, index }) => (
    <View style={{ flex: 1, backgroundColor: '#ffffff', marginVertical: 5 }}>
      <View style={{ flexDirection: 'row', flex: 1, padding: 10 }}>
        {item.users.userProfilePicture == null ? (
          <Image
            style={{ width: 42, height: 42, borderRadius: 42 / 2 }}
            source={require('../../assets/images/admin.jpg')}
            resizeMode="contain"
          />
        ) : (
          <Image
            style={{ width: 42, height: 42, borderRadius: 42 / 2 }}
            source={{ uri: item.users.userProfilePicture }}
          />
        )}
        <View style={{ position: 'absolute', right: 15, top: 10 }}>
          <Text style={{ color: '#ACACAD', fontSize: 16 }}>
            {item.created_at}
          </Text>
        </View>
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={{ color: '#293776', fontSize: 18 }}>
            {item.users.userName}
          </Text>
          <Text
            style={{
              color: '#5A5A5C',
              fontSize: 14,
              lineHeight: 22,
              marginTop: 3,
            }}>
            {item.comment}
          </Text>
        </View>
      </View>
      <View
        style={{
          width: '100%',
          height: 0.6,
          backgroundColor: '#ddd',
          marginVertical: 5,
        }}
      />

      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 10,
          marginBottom: 5,
          padding: 8,
        }}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => {
              this.handleChange(index, item.id);
            }}>
            <Image
              style={{ width: 22, height: 20 }}
              source={
                this.state.checked[index]
                  ? require('../../assets/images/fill_heart3x.png')
                  : require('../../assets/images/heart3x.png')
              }
            />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 10 }}>
            <Image
              style={{ width: 20, height: 20 }}
              source={require('../../assets/images/comment_2x.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={() => {
                this._toggleBottomNavigationView(item.id);
              }}>
              <Text style={{ marginRight: 8, color: '#8C8C8C', fontSize: 14 }}>
                {item.threadComments_count} Replies
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { }} style={{ flexDirection: 'row' }}>
              <Image
                style={{ width: 20, height: 20 }}
                source={require('../../assets/images/Like.png')}
              />
              <Text style={{ marginLeft: 8, color: '#8C8C8C', fontSize: 14 }}>
                {item.likes_on_comment_count}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  ReplyCommentrenderItem = ({ item, index }) => (
    <View style={{ flex: 1, backgroundColor: '#F7F8FA', marginVertical: 5 }}>
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          padding: 10,
          backgroundColor: '#F7F8FA',
        }}>
        {item.users.userProfilePicture == null ? (
          <Image
            style={{ width: 42, height: 42, borderRadius: 42 / 2 }}
            source={require('../../assets/images/admin.jpg')}
            resizeMode="contain"
          />
        ) : (
          <Image
            style={{ width: 42, height: 42, borderRadius: 42 / 2 }}
            source={{ uri: item.users.userProfilePicture }}
          />
        )}
        <View
          style={{
            flexDirection: 'row',
            padding: 5,
            flex: 1,
            borderRadius: 10,
            marginLeft: 10,
            backgroundColor: '#ffffff',
          }}>
          <View style={{ position: 'absolute', right: 15, top: 0 }}>
            <Text style={{ color: '#ACACAD', fontSize: 16 }}>
              {item.created_at}
            </Text>
          </View>
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={{ color: '#293776', fontSize: 18 }}>
              {item.users.userName}
            </Text>
            <Text
              style={{
                color: '#5A5A5C',
                fontSize: 14,
                lineHeight: 22,
                marginTop: 3,
              }}>
              {item.comment}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{ flexDirection: 'row', paddingHorizontal: 8, marginLeft: 58 }}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => {
              this.handleChange(index);
            }}>
            <Image
              style={{ width: 22, height: 20 }}
              source={
                this.state.checked[index]
                  ? require('../../assets/images/fill_heart3x.png')
                  : require('../../assets/images/heart3x.png')
              }
            />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 10 }}>
            <Image
              style={{ width: 20, height: 20 }}
              source={require('../../assets/images/comment_2x.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('FeedComments');
              }}
              style={{ flexDirection: 'row' }}>
              <Image
                style={{ width: 20, height: 20 }}
                source={require('../../assets/images/Like.png')}
              />
              <Text style={{ marginLeft: 8, color: '#8C8C8C', fontSize: 14 }}>
                {item.likes_on_thread_comment_count}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  render() {
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={this.state.CommentData}
            renderItem={this.CommentrenderItem}
            ListEmptyComponent={this.ListEmpty}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          />
        </KeyboardAwareScrollView>
        <View style={styles.footer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputs}
              placeholder="Write a comment..."
              underlineColorAndroid="transparent"
              onChangeText={comment => this.setState({ comment })}
            />

            <TouchableOpacity
              style={{
                height: 35,
                width: 35,
                borderRadius: 35 / 2,
                backgroundColor: Colors.primaryColor,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                this.addComment();
              }}>
              <Image
                style={{ width: 15, height: 15 }}
                source={require('../../assets/images/right-arrow3x.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
        <BottomSheet
          visible={this.state.visible}
          onBackButtonPress={this._toggleBottomNavigationView}
          onBackdropPress={this._toggleBottomNavigationView}>
          {/*Bottom Sheet inner View*/}
          <View style={styles.bottomNavigationView}>
            <View style={{ margin: 10, flex: 1 }}>
              <View
                style={{ alignItems: 'flex-end', marginRight: 10, marginTop: 5 }}>
                <TouchableOpacity
                  onPress={() => {
                    this._toggleBottomNavigationView();
                  }}>
                  <Image
                    style={{ width: 16, height: 16 }}
                    source={require('../../assets/images/close_3x.png')}
                  />
                </TouchableOpacity>
              </View>

              <View style={{ marginTop: 10 }}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={this.state.replyCommentData}
                  renderItem={this.ReplyCommentrenderItem}
                  ListEmptyComponent={this.ListEmpty}
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={this._onRefresh}
                    />
                  }
                />
              </View>
            </View>
            <View style={[styles.footer, { marginTop: 15 }]}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.inputs}
                  placeholder="Write a comment..."
                  underlineColorAndroid="transparent"
                  onChangeText={replycomment => this.setState({ replycomment })}
                />

                <TouchableOpacity
                  style={{
                    height: 35,
                    width: 35,
                    borderRadius: 35 / 2,
                    backgroundColor: Colors.primaryColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    this.replayComment();
                  }}>
                  <Image
                    style={{ width: 15, height: 15 }}
                    source={require('../../assets/images/right-arrow3x.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </BottomSheet>
        {this.state.isLoading ? (
          <Modal transparent={true}>
            <Loader />
          </Modal>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomNavigationView: {
    backgroundColor: '#F7F8FA',
    width: '100%',
    height: '75%',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  // list: {
  //   paddingHorizontal: 17,
  // },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    padding: 5,
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  inputs: {
    padding: 5,
    flex: 1,
  },

  itemIn: {
    alignSelf: 'flex-start',
    backgroundColor: '#0AD989',
  },
  itemOut: {
    alignSelf: 'flex-end',
    backgroundColor: '#23D2FF',
  },
});
