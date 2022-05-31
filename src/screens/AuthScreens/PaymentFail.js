import React, { Fragment } from 'react';
import { View, Modal, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

class PaymentFail extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: true,
       };
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
                        this.setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Image
                                style={{ marginTop: 10 }}
                                source={require('../../assets/Not10.png')}
                            />
                            <Text
                                style={{ marginTop: 20, fontWeight: 'bold', fontSize: 17 }}>
                                Payment Failed Try Again Later
                            </Text>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => {
                                    this.setModalVisible(!modalVisible)
                                    this.props.navigation.navigate('AuthLoading');
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
)(PaymentFail);

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
