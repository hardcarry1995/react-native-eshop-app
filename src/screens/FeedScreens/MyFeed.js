import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Modal,
} from 'react-native';
import Colors from '../../constants/colors';
import { BASE_URL } from '../API_baseURL';
import AsyncStorage from '@react-native-community/async-storage';
import { BottomSheet } from 'react-native-btr';
import PopUpMenu from '../MenuPopup';
import Loader from '../../components/loader';

export default class MyFeed extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      isLoading: false,
      visible: false,
      Like: false,
      checked: [],
      Data: [],

      // Data: [
      //   {
      //     name: 'Simmy Rianacmmvnm',
      //     date: '22 Jan',
      //     profile: '',
      //     content: 'Quickly embrace installed base architectures with lot of fun and activity users.',
      //     image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
      //     like: '25',
      //     comment: '50',
      //   },
      //   {
      //     name: 'Simmy Riana',
      //     date: '22 Jan',
      //     profile: '',
      //     content: 'Quickly embrace installed base architectures with lot of fun and activity users.',
      //     image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
      //     like: '25',
      //     comment: '50',
      //   },
      //   {
      //     name: 'David',
      //     date: '22 Jan',
      //     profile: '',
      //     content: 'Quickly embrace installed base architectures with lot of fun and activity users.',
      //     image: 'https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
      //     like: '25',
      //     comment: '50',
      //   },
      //   {
      //     name: 'Natasha',
      //     date: '24 Jan',
      //     profile: '',
      //     content: 'Quickly embrace installed base architectures with lot of fun and activity users.',
      //     image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
      //     like: '25',
      //     comment: '50',
      //   },
      // ],
      LikeData: [
        {
          name: 'Simmy Riana',
          image:
            'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
        },
        {
          name: 'Simmy Riana',
          image:
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
        },
        {
          name: 'David',
          image:
            'https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
        },
        {
          name: 'Natasha',
          image:
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
        },
      ],
    };
  }

  _toggleBottomNavigationView = () => {
    //Toggling the visibility state of the bottom sheet
    this.setState({ visible: !this.state.visible });
  };

  _toggleBottomCloseView = () => {
    this.setState({ visible: false });
  };

  handleChange = index => {
    let { checked } = this.state;
    checked[index] = !checked[index];
    this.setState({ checked });
  };
  componentWillMount() {
    this.getMyFeed();
  }
  getMyFeed = async () => {
    this.setState({ isLoading: true });
    let user_token = await AsyncStorage.getItem('user_token');
    return fetch(BASE_URL + 'user/own/feeds', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + user_token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ isLoading: false });
        // console.log("getExercise",JSON.stringify(responseJson.data))
        if (responseJson.status == true) {
          this.setState({
            Data: responseJson.message,
          });
        }
        if (responseJson.code === 300) {
          // alert(JSON.stringify(responseJson.message))
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  renderItem = ({ item, index }) => (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        marginHorizontal: 10,
        marginVertical: 5,
        paddingVertical: 5,
      }}>
      <View style={{ padding: 10 }}>
        <View style={{ flexDirection: 'row', flex: 1 }}>
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
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={{ color: '#293776', fontSize: 18 }}>
              {item.users.firstName}
            </Text>
            <Text style={{ color: '#ccc', fontSize: 16 }}>{item.created_at}</Text>
          </View>
          <PopUpMenu
            {...this.props}
            text={item.feed_content}
            img={item.feed_img_video}
            feed_id={item.id}
          />
        </View>
        <View style={{ marginTop: 5 }}>
          <Text style={{ color: '#444343', fontSize: 15, lineHeight: 22 }}>
            {item.feed_content}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate('FeedDetails', {
            ImageUlr: item.feed_img_video,
          });
        }}>
        <Image
          style={{ width: '100%', height: 200 }}
          source={{ uri: item.feed_img_video }}
        />
      </TouchableOpacity>

      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 10,
          marginVertical: 8,
        }}>
        <View>
          <TouchableOpacity
            onPress={this._toggleBottomNavigationView}
            style={{ flexDirection: 'row' }}>
            <Image
              style={{ width: 20, height: 20 }}
              source={require('../../assets/images/Like.png')}
            />
            <Text style={{ marginLeft: 5, color: '#444343', fontSize: 14 }}>
              25
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('FeedComments');
            }}>
            <Text style={{ color: '#444343', fontSize: 14 }}>50 Comments</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ width: '100%', height: 0.6, backgroundColor: '#ddd' }} />

      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 10,
          marginVertical: 8,
        }}>
        <View>
          <TouchableOpacity
            style={{ flexDirection: 'row' }}
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
            <Text style={{ marginLeft: 8, color: '#56575D', fontSize: 14 }}>
              {this.state.checked[index] ? 'Liked' : 'Like'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('FeedComments');
            }}
            style={{ flexDirection: 'row' }}>
            <Image
              style={{ width: 20, height: 20 }}
              source={require('../../assets/images/comment_2x.png')}
            />
            <Text style={{ marginLeft: 8, color: '#444343', fontSize: 14 }}>
              Comment
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // renderItem = ({ item, index }) => (
  //   <View style={{ flex: 1, backgroundColor: '#fff', marginHorizontal: 10, marginVertical: 5, paddingVertical: 5 }}>
  //     <View style={{ padding: 10 }}>
  //       <View style={{ flexDirection: 'row', flex: 1 }}>
  //         {/* <Image style={{ width: 42, height: 42, borderRadius: 42 / 2 }}
  //           source={{ uri: item.image }} /> */}
  //         <View style={{ marginLeft: 10, flex: 1, }}>
  //           <Text style={{ color: '#293776', fontSize: 18 }}>{item.id}</Text>
  //           <Text style={{ color: '#ccc', fontSize: 16 }}>{item.id}</Text>
  //         </View>
  //         {/* <PopUpMenu {...this.props} text={item.content}
  //           img={item.image} /> */}
  //       </View>
  //       <View style={{ marginTop: 5 }}>
  //         <Text style={{ color: '#444343', fontSize: 15, lineHeight: 22 }}>{item.id}</Text>
  //       </View>
  //     </View>
  //     {/* <TouchableOpacity
  //       onPress={() => { this.props.navigation.navigate('FeedDetails',{ ImageUlr: item.image }) }}>
  //       <Image style={{ width: '100%', height: 200 }}
  //         source={{ uri: item.image }} />
  //     </TouchableOpacity> */}

  //     <View style={{ flexDirection: 'row', paddingHorizontal: 10, marginVertical: 8, }}>
  //       <View>
  //         <TouchableOpacity onPress={this._toggleBottomNavigationView} style={{ flexDirection: 'row', }}>
  //           <Image style={{ width: 20, height: 20, }}
  //             source={require('../assets/images/Like.png')} />
  //           <Text style={{ marginLeft: 5, color: '#444343', fontSize: 14 }}>25</Text>
  //         </TouchableOpacity>
  //       </View>
  //       <View style={{ flex: 1, alignItems: 'flex-end' }}>
  //         <TouchableOpacity onPress={() => { this.props.navigation.navigate('FeedComments') }}>
  //           <Text style={{ color: '#444343', fontSize: 14 }}>50 Comments</Text>
  //         </TouchableOpacity>
  //       </View>
  //     </View>

  //     <View style={{ width: '100%', height: 0.6, backgroundColor: '#ddd' }} />

  //     <View style={{ flexDirection: 'row', paddingHorizontal: 10, marginVertical: 8 }}>
  //       <View>
  //       <TouchableOpacity style={{ flexDirection: 'row', }} onPress={() => {this.handleChange(index)
  //         }}>
  //           <Image style={{ width: 22, height: 20 }}
  //             source={this.state.checked[index] ? require('../assets/images/fill_heart3x.png') : require('../assets/images/heart3x.png')} />
  //           <Text style={{ marginLeft: 8, color: '#56575D', fontSize: 14 }}>{this.state.checked[index] ? "Liked" : "Like"}</Text>
  //         </TouchableOpacity>
  //       </View>
  //       <View style={{ flex: 1, alignItems: 'flex-end', }}>
  //         <TouchableOpacity onPress={() => { this.props.navigation.navigate('FeedComments') }} style={{ flexDirection: 'row' }}>
  //           <Image style={{ width: 20, height: 20 }}
  //             source={require('../assets/images/comment_2x.png')} />
  //           <Text style={{ marginLeft: 8, color: '#444343', fontSize: 14 }}>Comment</Text>
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //   </View>
  // );

  LikerenderItem = ({ item, index }) => (
    <View style={{ flex: 1, backgroundColor: '#fff', marginVertical: 5 }}>
      <View style={{ flexDirection: 'row' }}>
        <Image
          style={{ width: 42, height: 42, borderRadius: 42 / 2 }}
          source={{ uri: item.image }}
        />
        <View style={{ marginLeft: 18, justifyContent: 'center' }}>
          <Text style={{ color: '#293776', fontSize: 16, textAlign: 'center' }}>
            {item.name}
          </Text>
        </View>
      </View>
    </View>
  );

  _onRefresh = () => {
    //this.GetWorkOutList();
  };

  ListEmpty = () => {
    return (
      <View style={{ justifyContent: 'center' }}>
        <Text style={{ textAlign: 'center', color: Colors.dark_gray }}>
          No Record Found
        </Text>
      </View>
    );
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ justifyContent: 'center', flex: 1 }}>
          <ActivityIndicator color="#FE5665" size="large" />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={this.state.Data}
          renderItem={this.renderItem}
          ListEmptyComponent={this.ListEmpty}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        />

        <BottomSheet
          visible={this.state.visible}
          //setting the visibility state of the bottom shee
          onBackButtonPress={this._toggleBottomNavigationView}
          //Toggling the visibility state on the click of the back botton
          onBackdropPress={this._toggleBottomNavigationView}
        //Toggling the visibility state on the clicking out side of the sheet
        >
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
              <Text style={{ fontSize: 20, color: '#293776' }}>25 Likes</Text>
              <View style={{ marginTop: 10 }}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={this.state.LikeData}
                  renderItem={this.LikerenderItem}
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
    margin: 5,
    backgroundColor: '#F6F6F8',
  },
  bottomNavigationView: {
    backgroundColor: '#fff',
    width: '100%',
    height: '75%',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
});
