import React from 'react';
import { View, Modal, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import client from '../../constants/client';
import { encode, decode } from 'base-64';
import { gql } from '@apollo/client';


const HANDLE_LOGIN = gql`
 query login(
    $token: String
  ) {
    sSOLogin(jti:$token) {
      count
      currentPage
      message
      nextPage
      prevPage
      success
      totalPages
      result {
        firstName
        lastName
        userProfileImage
        email
        paymentUrl
        vGender
        streetAddress
        token
        tokenExpires
      }
    }
  }
`;

class PaymentSucess extends React.PureComponent {
   
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: true,
            url: this.props.route.params.url,
            email: this.props.route.params.email,
            password: this.props.params.password,
            // url: 'https://sandbox.payfast.co.za/eng/process?merchant_id=10001460&merchant_key=0j4uaurpqk87v&return_url=https%3a%2f%2fwww.LawyersEzyFind.co.za%2fLCPayFastReturn.html&cancel_url=https%3a%2f%2fwww.LawyersEzyFind.co.za%2fLCPayFastCancel.html&notify_url=http%3a%2f%2fmobileapiv2.ezyfind.co.za%2fapi%2fUser%2fNotify%3f&m_payment_id=13216&amount=1151.70&item_name=Company+33&item_description=Purchased+EzyFindMobileApi.Model.MstPackage+Package&subscription_type=1&recurring_amount=11.70&frequency=4&cycles=0',
        };
    }
    async submit() {
        let token = await AsyncStorage.getItem('userToken');
        client
            .query({
                query: HANDLE_LOGIN,
                fetchPolicy: 'no-cache',
                context: {
                    headers: {
                        Authorization: `Basic ${encode(
                            this.state.email.trim() + ':' + this.state.password.trim(),
                        )}`,
                    },

                    variables: {
                        tokenData: `${encode(token)}`,
                    },
                },
            })
            .then(async result => {
                if (result.data.sSOLogin.success) {
                    await AsyncStorage.setItem(
                        'userToken',
                        result.data.sSOLogin.result.token,
                    );
                    await AsyncStorage.setItem('IsLogin', 'true');
                    let decoded = decode(result.data.sSOLogin.result.token.split('.')[1]);
                    decoded = JSON.parse(decoded);
                    let userInfo = result.data.sSOLogin.result;
                    userInfo.id = decoded.Id;
                    const resultData = Object.values(decoded);
                    await AsyncStorage.setItem('userRole', resultData[3]);
                    await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
                    this.props.navigation.navigate('AuthLoading');
                } else {
                    ToastAndroid.show(result.data.sSOLogin.message, ToastAndroid.SHORT);
                }
            })
            .catch(err => {
                // this.setState({ loading: false });
                console.log('Login api', err);
            });
    }

    setModalVisible = visible => {
        this.setState({ modalVisible: visible });
    };

    render() {
        const { modalVisible } = this.state;

        return (
            <View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        // Alert.alert('Modal has been closed.');
                        this.setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Image
                                style={{ marginTop: 10 }}
                                source={require('../../assets/congratulation10.png')}
                            />
                            <Text
                                style={{ marginTop: 20, fontWeight: 'bold', fontSize: 17 }}>
                                Payment Sucessfully Done
                            </Text>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => {
                                    this.setModalVisible(!modalVisible)
                                    this.submit()
                                }}>
                                <Text style={styles.textStyle}>Continue</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    state: state,
});

const mapDispatchToProps = dispatch => ({
    setUserToken: value => {
        dispatch({
            type: 'SET_TOKEN',
            payload: value,
        });
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(PaymentSucess);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
        backgroundColor: 'rgba(0,0,0,0.5)',
        marginTop: -10,
        // backgroundColor:"#7A7A7A",
        // opacity:0.8
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 15,
        // height: '20%',
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 10,
        height: 30,
        width: 120,
        marginTop: 40,
        borderWidth: 1,
        borderColor: '#9F1D20',
    },
    butt: {
        borderRadius: 10,
        height: 30,
        width: 120,
        marginTop: 40,
        marginLeft: 20,
    },
    buttonClose: {
        backgroundColor: '#9F1D20',
    },

    textStyle: {
        color: 'white',
        fontSize: 15,
        alignSelf: 'center',
        marginTop: 4,
        marginLeft: 10,
    },


});
