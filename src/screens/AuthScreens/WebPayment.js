import React, { Fragment } from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { connect } from 'react-redux';

class WebPayment extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            url: this.props.route.params.url,
            email: this.props.route.params.email,
            password: this.props.route.params.password,
            // url: 'https://sandbox.payfast.co.za/eng/process?merchant_id=10001460&merchant_key=0j4uaurpqk87v&return_url=https%3a%2f%2fwww.LawyersEzyFind.co.za%2fLCPayFastReturn.html&cancel_url=https%3a%2f%2fwww.LawyersEzyFind.co.za%2fLCPayFastCancel.html&notify_url=http%3a%2f%2fmobileapiv2.ezyfind.co.za%2fapi%2fUser%2fNotify%3f&m_payment_id=13216&amount=1151.70&item_name=Company+33&item_description=Purchased+EzyFindMobileApi.Model.MstPackage+Package&subscription_type=1&recurring_amount=11.70&frequency=4&cycles=0',
        };
    }

    render() {
        return (
            <WebView
                source={{ uri: this.state.url }}
                ref={WEBVIEW_REF => (this.WebViewRef = WEBVIEW_REF)}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                onLoadProgress={({ nativeEvent }) => {
                    //your code goes here       
                }}
                onNavigationStateChange={(state) => {
                    if (state.url === 'https://www.lawyersezyfind.co.za/LCPayFastReturn.html') {
                        this.props.navigation.navigate('PaymentSuccess', { url: this.state.url, email: this.state.email, password: this.state.password });
                    } if (state.url === 'https://www.lawyersezyfind.co.za/LCPayFastCancel.html') {
                        this.props.navigation.navigate('PaymentFail')
                    }
                }}
            />
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
)(WebPayment);

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
