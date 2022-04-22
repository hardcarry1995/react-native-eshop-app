import React, { Component } from 'react';
import { ScrollView, TouchableOpacity, View, Image, Share, Platform, Linking } from 'react-native';
import { connect } from "react-redux";
import Colors from '../constants/colors';
import { Card, CardItem, Text, Left, Body } from 'native-base';
import { GUEST_LOGIN } from '../constants/queries';
import client from '../constants/client';
import Constant from '../constants/constant';
import Utils from '../constants/utils';
import { fontFamily, fontSize } from '../components/styles';
import AsyncStorage from '@react-native-community/async-storage';
import cont from '../components/cont';
import { bearerToken } from '../constants/utils';

class DrawerContent extends Component {
  state = {
    user_name: '',
    user_email: '',
    setuserRole: '',
    channels: [
      { screen: Constant.feed, title: Constant.feed, image: cont.feed },
      { screen: Constant.near_by, title: Constant.near_by, image: cont.near_by },
      { screen: Constant.settings, title: Constant.settings, image: cont.settings },
      { screen: Constant.privacy_policy, title: Constant.privacy_policy, image: cont.privacy_policy },
      { screen: Constant.term_condition, title: Constant.term_condition, image: cont.term_condition },
      { screen: Constant.faq, title: Constant.faq, image: cont.faq },
      { screen: Constant.contact_us, title: Constant.contact_us, image: cont.contact_us },
      { screen: Constant.about_us, title: Constant.about_us, image: cont.about_us, },
      { screen: Constant.my_Favirity, title: Constant.my_Favirity, image: cont.my_Favirity },
      { screen: Constant.my_Reviews, title: Constant.my_Reviews, image: cont.my_Reviews },
      { screen: "MyBid", title: "My Bids", image: cont.my_Reviews},
      { screen: "MyOrders", title: 'My Orders', image: cont.my_Reviews},
      { screen: Constant.rate_the_app, title: Constant.rate_the_app, image: cont.rate_the_app },
      { screen: Constant.give_feedback, title: Constant.give_feedback, image: cont.give_feedback },
      { screen: Constant.share_app, title: Constant.share_app, image: cont.share_app },
    ],
    selectedRoute: '',
    IsLoginData: 'false',
    userInfo: {},
  };

  componentDidMount = async () => {
    if( Object.keys(this.props.user).length > 0){
      this.setState({ 
        IsLoginData : 'true',
        user_name: this.props.user.name,
        user_email: this.props.user.email,
        user_image: this.props.user.image,
      })
    } else {
      let user_info = await AsyncStorage.getItem('userInfo');
      let IsLogin = await AsyncStorage.getItem('IsLogin');
      let userRole = await AsyncStorage.getItem('userRole');
      this.props.setUserRole(userRole);
      this.setState({ setuserRole: userRole })
      if (IsLogin == null) {
        this.setState({ IsLoginData: 'false' })
      } else {
        this.setState({ IsLoginData: IsLogin })
      }
      if (user_info) {
        let user_details = JSON.parse(user_info);
        this.props.setUser(user_details);
        this.setState({
          user_name: user_details.name,
          user_email: user_details.email,
          user_image: user_details.image,
        });
      }
    }
    
  };

  navigateToScreen = route => () => {
    this.setState({ selectedRoute: route === Constant.share_app ? '' : route });

    this.props.navigation.closeDrawer();
    switch (route) {
      case Constant.logout:
        this.handleSignOut();
        break;

      case Constant.change_password:
        this.props.navigation.navigate({ name: "AuthStack", screen: 'ResetPassword' });
        break;

      case Constant.near_by:
        this.props.navigation.navigate("ProductStack");
        break;
      case Constant.share_app:
        this.setState({ selectedRoute: Constant.feed_sidemenu });
        this.props.navigation.navigate('Feed');
        this._ShareApp();
        break;

      case Constant.my_request_stack:
        this.props.navigation.navigate(Constant.my_request_stack);
        this.setState({ selectedRoute: Constant.my_request_stack });
        break;

      case Constant.incoming_request:
        this.props.navigation.navigate(Constant.incoming_request);
        this.setState({ selectedRoute: Constant.incoming_request });
        break;

      case Constant.term_condition:
        this.props.navigation.navigate(Constant.term_condition, { screen : "TermCondition" });
        this.setState({ selectedRoute: Constant.incoming_request });
        break;
      case "incoming_enquiry": 
        this.props.navigation.navigate(Constant.feed, { screen: "IncomingEnquiry" });
        this.setState({ selectedRoute: "IncomingEnquiry" });
        break;
      case "my_enquiry" : 
        this.props.navigation.navigate(Constant.feed, { screen: "MyEnquiry" });
        this.setState({ selectedRoute: "MyEnquiry" });
        break;
      case  "Request an Item":
        this.props.navigation.navigate("RequestStack", {screen: "RequestItem"});
        this.setState({ selectedRoute: "Request an Item" });
        break;
      case Constant.settings: 
        this.props.navigation.navigate(Constant.settings, { screen: "SettingScreen" });
        this.setState({ selectedRoute: Constant.settings });
        break;
      case "MyBid" : 
        this.props.navigation.navigate(Constant.settings, { screen : "MyBid"});
        this.setState({ selectedRoute: "MyBid" });
        break;
      
      case Constant.give_feedback: 
        this.props.navigation.navigate("ContactStack", { screen : "ContactForm "});
        this.setState({ selectedRoute: Constant.give_feedback });
        break;
      case Constant.rate_the_app:
        if(Platform.OS === 'ios'){
          Linking.openURL('market://details?id=myandroidappid')
        } else if(Platform.OS === 'android'){
          Linking.openURL('itms-apps://itunes.apple.com/us/app/ezyfind/id1611700455?mt=8')
        }
        break;

      default:
        this.props.navigation.navigate(route);
        // const navigate = NavigationActions.navigate({
        //   routeName: route,
        // });
        // this.props.navigation.dispatch(navigate);
        break;
    }
  };

  getQuestToken = async () => {
    client
      .query({
        query: GUEST_LOGIN,
        context: {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            'Content-Length': 0,
          },
        },
      })
      .then(async result => {
        await AsyncStorage.setItem('userToken', result.data.guestLogin.result.value);
        this.props.setUser({});
        this.props.setUserRole('');
        this.props.navigation.reset({
          index: 0,
          routes: [{ name : 'Main'}]
        });
      })
      .catch(err => {
        this.setState({ loading: false });
        console.log(err);
      });
  }

  handleSignOut = async () => {
    await AsyncStorage.clear();
    this.getQuestToken();
  };

  _ShareApp = async () => {
    try {
      const result = await Share.share({
        message: 'https://apps.apple.com/us/app/ezyfind/id1611700455',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('result.activityType');
        } else {
          // shared
          console.log('shared');
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Utils.toastShow(error.message);
    }
  };


  renderChannelButtons() {
    return this.state.channels.map(({ screen, title, image }) => (
      <TouchableOpacity
        key={screen + title + image}
        onPress={this.navigateToScreen(screen)}
        activeOpacity={0.6}>
        <View transparent style={{ height: 46, marginTop: 2, marginBottom: 2 }}>
          {screen === this.state.selectedRoute ? (
            <View style={{ borderLeftColor: '#fff' }}>
              <CardItem style={{ borderLeftColor: '#fff', backgroundColor: '#FE5665' }} transparent>
                <Text
                  style={[
                    {
                      color: '#fff',
                      marginStart: 8,
                      fontFamily: fontFamily.regular,
                    },
                    styles.font_applied,
                  ]}>
                  {title}
                </Text>
              </CardItem>
            </View>
          ) : (
            <View style={{ backgroundColor: 'transparent' }}>
              <CardItem style={{ backgroundColor: 'transparent' }} transparent>
                <Image
                  style={{ height: 25, width: 25, resizeMode: 'contain' }}
                  source={image}
                />
                <Text
                  style={[
                    {
                      color: '#232323',
                      marginStart: 8,
                      fontFamily: fontFamily.regular,
                    },
                    styles.font_applied,
                  ]}>
                  {title}
                </Text>
              </CardItem>
            </View>
          )}
        </View>
      </TouchableOpacity>
    ));
  }

  render() {
    return (
      <View style={[styles.containerStyle]}>
        <View style={styles.avartaContainer} />
        <View style={{ paddingTop: 32 }}>
          <Card style={{ flex: 0, backgroundColor: 'transparent', marginLeft: 54 }} transparent>
            <CardItem style={{ backgroundColor: 'transparent' }} transparent>
              <Left>
                <Image source={ this.props.user.image ? { uri: this.props.user.image } : require('../assets/menu/User.png') } style={styles.img_view} />
                <Body>
                  <Text style={[{ color: '#fff' }, styles.font_applied]}>
                    {this.props.user.name}
                  </Text>
                  <Text
                    note
                    style={[{ color: '#fff', padding: 4, }, styles.font_applied]}>
                    {this.props.user.email}
                  </Text>
                </Body>
              </Left>
            </CardItem>
          </Card>
          { Object.keys(this.props.user).length == 0 &&
            <View>
              <TouchableOpacity
                onPress={this.navigateToScreen("AuthStack")}
                activeOpacity={0.6}>
                <Text style={styles.signupText}>Tap to Sign In/Sign Up Now</Text>
              </TouchableOpacity>
            </View>
          }
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          { Object.keys(this.props.user).length > 0 &&
            <View>
              <TouchableOpacity
                key={'Constant.edit_profile' + 'Constant.edit_profile' + 'cont.edit_profile'}
                onPress={this.navigateToScreen(Constant.edit_profile)}
                activeOpacity={0.6}>
                <View style={{ backgroundColor: 'transparent' }}>
                  <CardItem style={{ backgroundColor: 'transparent' }} transparent>
                    <Image
                      style={{ height: 25, width: 25, resizeMode: 'contain' }}
                      source={require('../assets/menu/User.png')}
                    />
                    <Text style={{ color: '#232323', marginStart: 8, fontFamily: fontFamily.regular }}>
                      Profile
                    </Text>
                  </CardItem>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                key={'Constant.my_request' + 'Constant.my_request' + 'cont.my_request'}
                onPress={this.navigateToScreen(Constant.my_request)}
                activeOpacity={0.6}>
                <View style={{ backgroundColor: 'transparent', paddingBottom: 1 }}>
                  <CardItem style={{ backgroundColor: 'transparent' }} transparent>
                    <Image
                      style={{ height: 25, width: 25, resizeMode: 'contain' }}
                      source={require('../assets/menu/clip.png')}
                      resizeMode="contain"
                    />
                    <Text style={ { color: '#232323', marginStart: 8, fontFamily: fontFamily.regular}}>
                      My Request
                    </Text>
                  </CardItem>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                    key='my_enquiry'
                    onPress={this.navigateToScreen("my_enquiry")}
                    activeOpacity={0.6}>
                    <View style={{ backgroundColor: 'transparent', paddingBottom: 1 }}>
                      <CardItem style={{ backgroundColor: 'transparent' }} transparent>
                        <Image
                          style={{ height: 25, width: 25, resizeMode: 'contain' }}
                          source={require('../assets/menu/clip.png')}
                          resizeMode="contain"
                        />
                        <Text style={{ color: '#232323', marginStart: 8, fontFamily: fontFamily.regular }}>
                          My Enquiry
                        </Text>
                      </CardItem>
                    </View>
                  </TouchableOpacity>
              {this.props.userRole == 'Main Business User' &&
                <>
                  <TouchableOpacity
                    key={'Constant.incoming_request' + 'Constant.incoming_request' + 'cont.incoming_request'}
                    onPress={this.navigateToScreen(Constant.incoming_request)}
                    activeOpacity={0.6}>
                    <View style={{ backgroundColor: 'transparent', paddingBottom: 1 }}>
                      <CardItem style={{ backgroundColor: 'transparent' }} transparent>
                        <Image
                          style={{ height: 25, width: 25, resizeMode: 'contain' }}
                          source={require('../assets/menu/clip.png')}
                          resizeMode="contain"
                        />
                        <Text
                          style={[
                            {color: '#232323',marginStart: 8,fontFamily: fontFamily.regular},
                            styles.font_applied,
                          ]}>
                          Incoming Requests
                        </Text>
                      </CardItem>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    key='incoming_enquiry'
                    onPress={this.navigateToScreen('incoming_enquiry')}
                    activeOpacity={0.6}>
                    <View style={{ backgroundColor: 'transparent', paddingBottom: 1 }}>
                      <CardItem style={{ backgroundColor: 'transparent' }} transparent>
                        <Image
                          style={{ height: 25, width: 25, resizeMode: 'contain' }}
                          source={require('../assets/menu/clip.png')}
                          resizeMode="contain"
                        />
                        <Text style={{ color: '#232323', marginStart: 8, fontFamily: fontFamily.regular }}>
                          Incoming Enquiry
                        </Text>
                      </CardItem>
                    </View>
                  </TouchableOpacity>
                </>
              }
            </View>
          }
          <View>{this.renderChannelButtons()}</View>
          {Object.keys(this.props.user).length > 0 &&
            <TouchableOpacity
              key={'Constant.logout' + 'Logout' + '../assets/menu/logout.png'}
              onPress={this.navigateToScreen(Constant.logout)}
              activeOpacity={0.6}>
              <View style={{ backgroundColor: 'transparent', paddingBottom: 20 }}>
                <CardItem style={{ backgroundColor: 'transparent' }} transparent>
                  <Image
                    style={{ height: 25, width: 25, resizeMode: 'center' }}
                    source={require('../assets/menu/logout.png')}
                    resizeMode="contain"
                  />
                  <Text style={{ color: '#232323', marginStart: 8, fontFamily: fontFamily.regular }}>
                    Logout
                  </Text>
                </CardItem>
              </View>
            </TouchableOpacity>
          }
        </ScrollView>
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    flex: 1,
  },
  avartaContainer: {
    flex: 1,
    backgroundColor: Colors.primaryColor,
    position: 'absolute',
    top: 0,
    bottom: 0,
    height: '100%',
    width: 300,
    opacity: 0.9,
  },
  font_applied: {
    fontFamily: fontFamily.regular,
  },
  img_view: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    marginBottom: -10,
  },
  signupText: {
    fontSize: 10,
    color: 'gray',
    marginLeft: 30
  },

  imageStyle: { borderRadius: 50 / 2 },
};

const mapStateToProps = state => ({
  user : state.user,
  userRole: state.userRole
})

const mapDispatchToProps = dispatch => ({
  setUser: user => dispatch({
    type: 'SET_USER',
    payload: user
  }),
  setUserRole: role => dispatch({
    type: 'SET_USER_ROLE',
    payload: role
  })
})

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContent);
