import * as React from 'react';
import { Text, View, Image, TouchableOpacity, Keyboard, SafeAreaView, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-elements';
import { ifIphoneX } from 'react-native-iphone-x-helper'
import Colors from '../constants/colors';
import Constants from '../constants/constant';
import { connect } from "react-redux";
import client from '../constants/client';
import { GET_SHOPPING_CART } from '../constants/queries';
import AsyncStorage from '@react-native-community/async-storage';

const Tab = ({ title, activeImage, unactiveImage, onPress, isFocused, isShowBadge, badge_value }) => {
  return (
    <TouchableOpacity style={{ flex: 1 }} onPress={onPress}>
      <View style={{ alignItems: 'center' }}>
        <Image source={isFocused ? activeImage : unactiveImage} style={isFocused ? styles.activeTabImage : styles.inActiveTabImage} resizeMode="contain" />
        <Text style={isFocused ? styles.activeTitle : styles.inActiveTitle}>{title}</Text>
        {isShowBadge && (
          <View style={{ position: 'absolute', top: -5 }}>
            <Avatar
              rounded
              size={20}
              title={badge_value}
              containerStyle={{ marginLeft: 40 }}
              overlayContainerStyle={{ backgroundColor: Colors.red }}
              titleStyle={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

//large tab bar icon

const Tablarge = ({ title, activeImage, unactiveImage, onPress, isFocused }) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <View style={styles.largeButtonContainer}>
        <Image style={styles.larginButtonImage} resizeMode="contain" source={isFocused ? activeImage : unactiveImage} />
      </View>
    </TouchableOpacity>
  );
};

class TabBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isVisible: true,
      cartCount: 0
    };
  }
  async componentDidMount() {
    this.keyboardWillShowSub = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardWillShow,
    );
    this.keyboardWillHideSub = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardWillHide,
    );
    let token = await AsyncStorage.getItem('userToken');
    this.getShoppingCart(token)

  }
  getShoppingCart = (Token) => {
    this.setState({ cartLoading: true });
    client
      .mutate({
        mutation: GET_SHOPPING_CART,
        context: {
          headers: {
            Authorization: `Bearer ${Token}`,
            'Content-Length': 0,
          },
        },
      })
      .then(result => {
        if (result?.data?.getPrdShoppingCart?.success && result?.data?.getPrdShoppingCart?.count > 0) {
          // this.setState({ cartCount :  result?.data?.getPrdShoppingCart?.count })
          console.log("Cart Data:", result?.data?.getPrdShoppingCart);
          this.props.setCartItems(result?.data?.getPrdShoppingCart.result.prdShoppingCartDto);
        }
      })
     
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  keyboardWillShow = event => {
    this.setState({
      isVisible: false,
    });
  };

  keyboardWillHide = event => {
    this.setState({
      isVisible: true,
    });
  };

  render() {
    const { navigation } = this.props;
    const navigationState = this.props.state;
    return this.state.isVisible ? (
        <View style={styles.tabBarContainer}>
          {this.props.state.routes.map((route, index) => {
            if (route.name === 'HomeStack') {
              return (
                <Tab
                  title={'Home'}
                  activeImage={require('../assets/menu/home.png')}
                  unactiveImage={require('../assets/menu/home.png')}
                  onPress={() => {
                    navigation.navigate(route.name, {});
                  }}
                  isFocused={navigationState.index == index}
                />
              );
            } else if (route.name === Constants.my_request_stack) {
              return (
                <Tab
                  title={'My Requests'}
                  activeImage={require('../assets/img/product.png')}
                  unactiveImage={require('../assets/img/product.png')}
                  onPress={() => {
                    navigation.navigate(route.name);
                  }}
                  isFocused={navigationState.index == index}
                />
              );
            } else if (route.name === 'CategoryStack') {
              return (
                <Tablarge
                  title={''}
                  activeImage={require('../assets/menu/request.png')}
                  unactiveImage={require('../assets/menu/request.png')}
                  onPress={() => {
                    navigation.navigate(route.name);
                  }}
                  isFocused={navigationState.index == index}
                />
              );
            } else if (route.name === 'CartStack') {
              // Item Cart
              return (
                <Tab
                  title={'ItemCart'}
                  activeImage={require('../assets/menu/cart.png')}
                  unactiveImage={require('../assets/menu/cart.png')}
                  onPress={() => {
                    navigation.navigate(route.name);
                  }}
                  isShowBadge
                  badge_value={this.props.userState.carts.length}
                  isFocused={navigationState.index == index}
                />
              );
            } else if (route.name === 'WishStack') {
              return (
                <Tab
                  title={'Wish List'}
                  activeImage={require('../assets/menu/heart.png')}
                  unactiveImage={require('../assets/menu/heart.png')}
                  onPress={() => {
                    navigation.navigate(route.name);
                  }}
                  isFocused={navigationState.index == index}
                />
              );
            }
          })}
        </View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  tabBarContainer: {
    ...ifIphoneX({
      height: 90,
      paddingBottom: 20
    }, {
      height: 70,
    }),
    backgroundColor: '#DB3236',
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowRadius: 5,
    shadowOpacity: 0.5,
    shadowColor: '#ccc',
    elevation: 10,
  },
  largeButtonContainer: {
    alignItems: 'center',
    elevation: 0.1,
    marginTop: -10,
    width: 70,
    height: 70,
    marginBottom: 50,
    shadowOpacity: 0.1,
    backgroundColor: '#fff',
    borderRadius: 35,
    shadowRadius: 1,
  },
  larginButtonImage: {
    width: 55,
    height: 55,
    marginTop: 10,
  },
  activeTabImage: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  inActiveTabImage: {
    width: 24,
    height: 24,
  },
  activeTitle: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    color: '#fff'
  },
  inActiveTitle: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    color: '#9F1D20',
  }
})

const mapStateToProps = state => ({
  userState : state
})

const mapDispatchToProps = (dispatch) => ({
  setCartItems: value => {
    dispatch({
      type: 'GET_CARTS_ITEMS',
      payload: value,
    });
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(TabBar);
