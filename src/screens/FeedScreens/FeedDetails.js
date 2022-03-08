import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  ImageBackground,
  FlatList,
  RefreshControl,
  SafeAreaView,
  Modal,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { BASE_URL } from '../API_baseURL';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../components/loader';
import Toast from 'react-native-root-toast';

export default class FeedDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      url: this.props.navigation.getParam('ImageUlr'),
      id: this.props.navigation.getParam('id'),
      data: [
        {
          name: 'David',
          date: 'just Now',
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

  getListComment = async () => {
    this.setState({ isLoading: true });
    let params = { feed_id: this.state.id };
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
        if (responseJson.status === true) {
          this.setState({ CommentData: responseJson.message });
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
  CommentrenderItem = ({ item, index }) => (
    <View style={{ margin: 15 }}>
      <View style={{ flexDirection: 'row', padding: 10 }}>
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
            {item.users.userName}
          </Text>
          <Text style={{ color: '#ACACAD', fontSize: 16 }}>
            {item.created_at}
          </Text>
        </View>
      </View>
      <View style={{ paddingHorizontal: 10 }}>
        <Text style={{ color: '#5A5A5C', fontSize: 15, lineHeight: 22 }}>
          {item.comment}
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 10,
          marginVertical: 10,
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
              {item.likes_on_comment_count}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('FeedComments');
            }}>
            <Text style={{ color: '#444343', fontSize: 14 }}>
              {item.threadComments_count} Comments
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        {console.log(this.state.CommentData)}
        <View style={styles.container}>
          <StatusBar
            backgroundColor="transparent"
            translucent
            barStyle="light-content"
          />
          <ImageBackground
            style={{ height: '55%', width: '100%', resizeMode: 'cover', flex: 1 }}
            source={{ uri: this.state.url }}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}
              style={[textHeader.leftIcon, { marginTop: 25 }]}>
              <Image
                source={require('../../assets/images/arrow-left_3x.png')}
                style={{ width: 11, height: 20, alignSelf: 'flex-start' }}
              />
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
                backgroundColor: '#fff',
                marginTop: '60%',
                borderTopLeftRadius: 32,
                borderTopRightRadius: 32,
              }}>
              <ScrollView>
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
                {/* <View style={{ margin: 15 }}>
                  <View style={{ flexDirection: 'row', padding: 10 }}>
                    <Image style={{ width: 42, height: 42, borderRadius: 42 / 2 }}
                      source={{ uri: "https://previews.123rf.com/images/georgerudy/georgerudy1705/georgerudy170500116/77194221-beautiful-young-sports-people-are-working-out-with-trx-in-gym.jpg" }} />
                    <View style={{ marginLeft: 10, flex: 1, }}>
                      <Text style={{ color: '#293776', fontSize: 18 }}>Mike</Text>
                      <Text style={{ color: '#ACACAD', fontSize: 16 }}>22 Jan</Text>
                    </View>
                  </View>
                  <View style={{ paddingHorizontal: 10, }}>
                    <Text
                      style={{ color: '#5A5A5C', fontSize: 15, lineHeight: 22, }}>Holisticly leverage other's synergistic potentialities through real-time niches. Credilbly negotiate wireless applications whereas real-time platforms.</Text>
                  </View>

                  <View style={{ flexDirection: 'row', paddingHorizontal: 10, marginVertical: 10, }}>
                    <View>
                      <TouchableOpacity onPress={this._toggleBottomNavigationView} style={{ flexDirection: 'row', }}>
                        <Image style={{ width: 20, height: 20, }}
                          source={require('../assets/images/Like.png')} />
                        <Text style={{ marginLeft: 5, color: '#444343', fontSize: 14 }}>25</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                      <TouchableOpacity onPress={() => { this.props.navigation.navigate('FeedComments') }}>
                        <Text style={{ color: '#444343', fontSize: 14 }}>50 Comments</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View> */}

                {/* Reply */}
                {/* <View style={{ flex: 1, backgroundColor: '#F7F8FA', }}>
                  <View style={{ flexDirection: 'row', padding: 10, backgroundColor: '#F7F8FA', }}>
                    <Image style={{ width: 42, height: 42, borderRadius: 42 / 2 }}
                      source={{ uri: "https://previews.123rf.com/images/georgerudy/georgerudy1705/georgerudy170500116/77194221-beautiful-young-sports-people-are-working-out-with-trx-in-gym.jpg" }} />
                    <View style={{ flexDirection: 'row', padding: 5, flex: 1, marginLeft: 10 }}>
                      <View style={{ position: 'absolute', right: 15, top: 5, }}>
                        <Text style={{ color: '#ACACAD', fontSize: 16 }}>Just Now</Text>
                      </View>
                      <View style={{ marginLeft: 10, }}>
                        <Text style={{ color: '#293776', fontSize: 18 }}>David</Text>
                        <Text style={{ color: '#5A5A5C', fontSize: 15, lineHeight: 22, marginTop: 3 }}>Holisticly leverage other's synergistic potentialities through real-time niches. Credilbly negotiate wireless applications whereas real-time platforms.</Text>
                      </View>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', paddingHorizontal: 10, marginLeft: 58 }}>
                    <View style={{ flexDirection: 'row', }}>
                      <TouchableOpacity>
                        <Image style={{ width: 22, height: 20 }}
                          source={2 == 2 ? require('../assets/images/fill_heart3x.png') : require('../assets/images/heart3x.png')} />
                      </TouchableOpacity>
                      <TouchableOpacity style={{ marginLeft: 10 }}>
                        <Image style={{ width: 20, height: 20 }}
                          source={require('../assets/images/comment_2x.png')} />
                      </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 15 }}>
                      <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('FeedComments') }} style={{ flexDirection: 'row' }}>
                          <Image style={{ width: 20, height: 20 }}
                            source={require('../assets/images/Like.png')} />
                          <Text style={{ marginLeft: 8, color: '#8C8C8C', fontSize: 14 }}>25</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <View style={{ width: '100%', height: 0.6, backgroundColor: '#ddd', marginVertical: 10, marginLeft: 60 }} />
                </View>

              
                <View style={{ flex: 1, backgroundColor: '#F7F8FA', }}>
                  <View style={{ flexDirection: 'row', padding: 10, backgroundColor: '#F7F8FA', }}>
                    <Image style={{ width: 42, height: 42, borderRadius: 42 / 2 }}
                      source={{ uri: "https://previews.123rf.com/images/georgerudy/georgerudy1705/georgerudy170500116/77194221-beautiful-young-sports-people-are-working-out-with-trx-in-gym.jpg" }} />
                    <View style={{ flexDirection: 'row', padding: 5, flex: 1, marginLeft: 10 }}>
                      <View style={{ position: 'absolute', right: 15, top: 5, }}>
                        <Text style={{ color: '#ACACAD', fontSize: 16 }}>Just Now</Text>
                      </View>
                      <View style={{ marginLeft: 10, }}>
                        <Text style={{ color: '#293776', fontSize: 18 }}>David</Text>
                        <Text style={{ color: '#5A5A5C', fontSize: 15, lineHeight: 22, marginTop: 3 }}>Holisticly leverage other's synergistic potentialities through real-time niches. Credilbly negotiate wireless applications whereas real-time platforms.</Text>
                      </View>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', paddingHorizontal: 10, marginLeft: 58 }}>
                    <View style={{ flexDirection: 'row', }}>
                      <TouchableOpacity>
                        <Image style={{ width: 22, height: 20 }}
                          source={2 == 2 ? require('../assets/images/fill_heart3x.png') : require('../assets/images/heart3x.png')} />
                      </TouchableOpacity>
                      <TouchableOpacity style={{ marginLeft: 10 }}>
                        <Image style={{ width: 20, height: 20 }}
                          source={require('../assets/images/comment_2x.png')} />
                      </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 15 }}>
                      <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('FeedComments') }} style={{ flexDirection: 'row' }}>
                          <Image style={{ width: 20, height: 20 }}
                            source={require('../assets/images/Like.png')} />
                          <Text style={{ marginLeft: 8, color: '#8C8C8C', fontSize: 14 }}>25</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <View style={{ width: '100%', height: 0.6, backgroundColor: '#ddd', marginVertical: 10, marginLeft: 60 }} />
                </View> */}
              </ScrollView>
            </View>
          </ImageBackground>
          {this.state.isLoading ? (
            <Modal transparent={true}>
              <Loader />
            </Modal>
          ) : null}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bottomNavigationView: {
    backgroundColor: '#F7F8FA',
    width: '100%',
    height: '60%',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
});

// import React in our code
// import React, {useState, useRef} from 'react';

// // import all the components we are going to use
// import {SafeAreaView, StyleSheet, Text, View} from 'react-native';

// //Import React Native Video to play video
// import Video from 'react-native-video';

// //Media Controls to control Play/Pause/Seek and full screen
// import
//   MediaControls, {PLAYER_STATES}
// from 'react-native-media-controls';

// const App = () => {
//   const videoPlayer = useRef(null);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [isFullScreen, setIsFullScreen] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [paused, setPaused] = useState(false);
//   const [
//     playerState, setPlayerState
//   ] = useState(PLAYER_STATES.PLAYING);
//   const [screenType, setScreenType] = useState('content');

//   const onSeek = (seek) => {
//     //Handler for change in seekbar
//     videoPlayer.current.seek(seek);
//   };

//   const onPaused = (playerState) => {
//     //Handler for Video Pause
//     setPaused(!paused);
//     setPlayerState(playerState);
//   };

//   const onReplay = () => {
//     //Handler for Replay
//     setPlayerState(PLAYER_STATES.PLAYING);
//     videoPlayer.current.seek(0);
//   };

//   const onProgress = (data) => {
//     // Video Player will progress continue even if it ends
//     if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
//       setCurrentTime(data.currentTime);
//     }
//   };

//   const onLoad = (data) => {
//     setDuration(data.duration);
//     setIsLoading(false);
//   };

//   const onLoadStart = (data) => setIsLoading(true);

//   const onEnd = () => setPlayerState(PLAYER_STATES.ENDED);

//   const onError = () => alert('Oh! ', error);

//   const exitFullScreen = () => {
//     alert('Exit full screen');
//   };

//   const enterFullScreen = () => {};

//   const onFullScreen = () => {
//     setIsFullScreen(isFullScreen);
//     if (screenType == 'content') setScreenType('cover');
//     else setScreenType('content');
//   };

//   const renderToolbar = () => (
//     <View>
//       <Text style={styles.toolbar}> toolbar </Text>
//     </View>
//   );

//   const onSeeking = (currentTime) => setCurrentTime(currentTime);

//   return (
//     <View style={{flex: 1}}>
//       <Video
//         onEnd={onEnd}
//         onLoad={onLoad}
//         onLoadStart={onLoadStart}
//         onProgress={onProgress}
//         paused={paused}
//         ref={videoPlayer}
//         resizeMode={screenType}
//         onFullScreen={isFullScreen}
//         source={{
//           uri:
//             'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
//         }}
//         style={styles.mediaPlayer}
//         volume={10}
//       />
//       <MediaControls
//         duration={duration}
//         isLoading={isLoading}
//         mainColor="#333"
//         onFullScreen={onFullScreen}
//         onPaused={onPaused}
//         onReplay={onReplay}
//         onSeek={onSeek}
//         onSeeking={onSeeking}
//         playerState={playerState}
//         progress={currentTime}
//         toolbar={renderToolbar()}
//       />
//     </View>
//   );
// };

// export default App;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   toolbar: {
//     marginTop: 30,
//     // backgroundColor: 'white',
//     padding: 10,
//     borderRadius: 5,
//   },
//   mediaPlayer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     bottom: 0,
//     right: 0,
//     // backgroundColor: 'black',
//     justifyContent: 'center',
//   },
// });
