import React, { Component } from 'react';
import { ScrollView, TouchableOpacity, View, Image, Share } from 'react-native';
import Colors from '../constants/colors';
import { Card, CardItem, Text, Left, Body } from 'native-base';
import Constant from '../constants/constant';
import Utils from '../constants/utils';
import { fontFamily, fontSize } from '../components/styles';
import AsyncStorage from '@react-native-community/async-storage';
import cont from '../components/cont';

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
      { screen: Constant.rate_the_app, title: Constant.rate_the_app, image: cont.rate_the_app },
      { screen: Constant.give_feedback, title: Constant.give_feedback, image: cont.give_feedback },
      { screen: Constant.share_app, title: Constant.share_app, image: cont.share_app },
    ],
    selectedRoute: '',
    IsLoginData: 'false',
    userInfo: {},
  };

  componentDidMount = async () => {
    let user_info = await AsyncStorage.getItem('user_info');
    let IsLogin = await AsyncStorage.getItem('IsLogin');
    let userRole = await AsyncStorage.getItem('userRole');
    this.setState({ setuserRole: userRole })
    if (IsLogin == null) {
      this.setState({ IsLoginData: 'false' })
    } else {
      this.setState({ IsLoginData: IsLogin })
    }
    if (user_info) {
      let user_details = JSON.parse(user_info);
      this.setState({
        user_name: user_details.name,
        user_email: user_details.email,
        user_image: user_details.image,
      });
    }
    console.log('hi', this.state.IsLoginData);
  };

  navigateToScreen = route => () => {
    this.setState({ selectedRoute: route === Constant.share_app ? '' : route });

    this.props.navigation.closeDrawer();
    switch (route) {
      case Constant.logout:
        console.log('logout');
        this.handleSignOut();
        break;

      case Constant.change_password:
        console.log('change password');
        this.props.navigation.navigate(Constant.change_password);
        break;

      case Constant.near_by:
        console.log('change password');
        this.props.navigation.navigate('Matches');
        break;

      case Constant.feed:
        console.log('change password');
        this.props.navigation.navigate('FeedStack');
        break;

      case Constant.share_app:
        console.log('share app');
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

      default:
        // const navigate = NavigationActions.navigate({
        //   routeName: route,
        // });
        // this.props.navigation.dispatch(navigate);
        break;
    }
  };

  handleSignOut = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('AuthLoading');
  };

  _ShareApp = async () => {
    try {
      const result = await Share.share({
        message: 'Ezyfind',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
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

      </TouchableOpacity>
    ));
  }

  render() {
    return (
      <View style={[styles.containerStyle]}>
        <View style={styles.avartaContainer} />

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
    // alignSelf:'center'
    marginLeft: 30
  },

  imageStyle: { borderRadius: 50 / 2 },
};

export default DrawerContent;
