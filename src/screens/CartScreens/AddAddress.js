import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, TextInput, ActivityIndicator, ToastAndroid } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ADD_ADDRESS, GET_PROVINCE, GET_CITY, GET_SUBURB } from '../../constants/queries';
import AsyncStorage from '@react-native-community/async-storage';
import client from '../../constants/client';
import moment from 'moment';
import RNPickerSelect from 'react-native-picker-select';


export default class AddAddress extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cartLoading: false,
            province: [],
            suburb: [],
            city: [],
            selectProvince: '',
            selectSub: '',
            selectCity: '',
            loading: false,
            totalCount: '0',
            latitude: '',
            longitude: '',
            streetAddress: '',
            zipcode: '',
            loading: false
        };
    }
    componentDidMount() {
        this.fetchProvince();
    }
    async fetchProvince() {
        let token = await AsyncStorage.getItem('userToken');
        client
            .query({
                query: GET_PROVINCE,
                context: {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            })
            .then(async result => {
                console.log('resultresultresultresult', result)
                if (result.data.getProvince.success) {
                    const updateProvinces = result.data.getProvince.result.map((item ) => {
                        return {
                          ...item,
                          label: item.provinceName,
                          value: item.provinceId
                        }
                      })
                    this.setState({ province: updateProvinces })
                } else {
                    ToastAndroid.show(
                        result.data.getProvince.message,
                        ToastAndroid.SHORT,
                    );
                }
            })
            .catch(err => {
                console.log(err);
            });
    };

    async fetchCity(id) {
        if (id === '') {
            return;
        }
        let token = await AsyncStorage.getItem('userToken');
        client
            .query({
                query: GET_CITY,
                context: {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
                variables: {
                    id: Number(id),
                },
            })
            .then(async result => {
                if (result.data.getCityByProvince.success) {
                    const updatedCities = result.data.getCityByProvince.result.map(item => {
                        return {
                            ...item,
                            label : item.cityName,
                            value : item.cityId
                        }
                    })
                    this.setState({ city: updatedCities })
                } else {
                    ToastAndroid.show(
                        result.data.getCityByProvince.message,
                        ToastAndroid.SHORT,
                    );
                }
            })
            .catch(err => {
                console.log(err);
            });
    };
    async fetchSuburb(id) {
        if (id === '') {
            return;
        }
        let token = await AsyncStorage.getItem('userToken');
        client
            .query({
                query: GET_SUBURB,
                context: {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
                variables: {
                    id: Number(id),
                },
            })
            .then(async result => {
                if (result.data.getSuburbByCity.success) {
                    const updatedSuperb = result.data.getSuburbByCity.result.map(item => {
                        return {
                            ...item,
                            label : item.suburbName,
                            value : item.suburbId
                        }
                    })
                    this.setState({ suburb: updatedSuperb })
                } else {
                    ToastAndroid.show(
                        result.data.getSuburbByCity.message,
                        ToastAndroid.SHORT,
                    );
                }
            })
            .catch(err => {
                console.log(err);
            });
    };

    async AddAddressData() {
        let token = await AsyncStorage.getItem('userToken');
        let resultdata = await AsyncStorage.getItem('userInfo');
        let jsondata = JSON.parse(resultdata);
        this.setState({ loading: true });
        if (this.state.selectProvince == '') {
            ToastAndroid.show('Please select province ', ToastAndroid.SHORT);
            this.setState({ loading: false });
            return;
        }
        if (this.state.selectCity == '') {
            ToastAndroid.show('Please select city ', ToastAndroid.SHORT);
            this.setState({ loading: false });
            return;
        }
        if (this.state.selectSub == '') {
            ToastAndroid.show('Please select suburb', ToastAndroid.SHORT);
            this.setState({ loading: false });
            return;
        }

        if (this.state.streetAddress == '') {
            ToastAndroid.show('Please enter street address', ToastAndroid.SHORT);
            this.setState({ loading: false });
            return;
        }

        if (this.state.zipcode == '') {
            ToastAndroid.show('Please enter zipcode', ToastAndroid.SHORT);
            this.setState({ loading: false });
            return;
        }
        if (this.state.latitude == '') {
            ToastAndroid.show('Please enter latitude', ToastAndroid.SHORT);
            this.setState({ loading: false });
            return;
        }
        if (this.state.longitude == '') {
            ToastAndroid.show('Please enter longitude', ToastAndroid.SHORT);
            this.setState({ loading: false });
            return;
        }
       
        client
            .mutate({
                mutation: ADD_ADDRESS,
                fetchPolicy: 'no-cache',
                variables: {
                    zipCode: this.state.zipcode,
                    streetAddress: this.state.streetAddress,
                    latitude: this.state.latitude,
                    longitude: this.state.longitude,
                    userId: parseInt(jsondata.id),
                    provinceID: parseInt(this.state.selectProvince),
                    cityID: parseInt(this.state.selectCity),
                    suburbID: parseInt(this.state.selectSub),
                    curdate: moment().toISOString()
                },
                context: {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                },
            })
            .then(async result => {
                this.setState({ loading: false });
                console.log(result.data.postUserAddress);
                if (result.data.postUserAddress.success) {                  
                    ToastAndroid.show(
                        result.data.postUserAddress.message,
                        ToastAndroid.SHORT,
                    );
                    this.props.navigation.goBack();
                } else {
                    ToastAndroid.show(
                        result.data.postUserAddress.message,
                        ToastAndroid.SHORT,
                    );
                }
            })
            .catch(err => {
                this.setState({loading:false});
                console.log('address', err);
            });
    }

    render() {
        return (
            <ScrollView>
                <View style={{ backgroundColor: 'white', flex: 1 }}>
                    <View style={{ marginTop: 2 }}>
                        <View style={styles.paddingview}>
                            <View style={{ borderRadius: 10, borderColor: '#E22727', borderWidth: 1, height: 50, marginTop: 15 }}>
                                <RNPickerSelect
                                    value={this.state.selectProvince}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.setState({ selectProvince: itemValue })
                                        this.fetchCity(itemValue);
                                    }}
                                    items={this.state.province}
                                    textInputProps={styles.pickerContainer}
                                    placeholder= {{ label: "Select a province...", value: null }}
                                />
                            </View>

                            <View style={{ borderRadius: 10, borderColor: '#E22727', borderWidth: 1, height: 50, marginTop: 15 }}>
                                <RNPickerSelect
                                    value={this.state.selectCity}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.setState({ selectCity: itemValue })
                                        this.fetchSuburb(itemValue);
                                    }}
                                    items={this.state.city}
                                    textInputProps={styles.pickerContainer}            
                                    placeholder= {{ label: "Select a city...", value: null }}
                                />
                            </View>

                            <View style={{ borderRadius: 10, borderColor: '#E22727', borderWidth: 1, height: 50, marginTop: 15 }}>
                                <RNPickerSelect
                                    value={this.state.selectSub}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.setState({ selectSub: itemValue })
                                    }}
                                    items={this.state.suburb}
                                    textInputProps={styles.pickerContainer}
                                    placeholder= {{ label: "Select a sub...", value: null }}
                                />
                            </View>
                         
                            <TextInput
                                onChangeText={text => this.setState({ streetAddress: text })}
                                style={{ borderWidth: 1, borderRadius: 10, height: 50, borderColor: '#E22727', marginTop: 15, paddingLeft: 10 }}
                                placeholder="Street Address"
                                placeholderTextColor="gray"
                            />
                            <TextInput
                                onChangeText={text => this.setState({ zipcode: text })}
                                style={{ borderWidth: 1, borderRadius: 10, height: 50, borderColor: '#E22727', marginTop: 15, paddingLeft: 10 }}
                                placeholder="Zipcode"
                                placeholderTextColor="gray"
                                keyboardType="number-pad"
                                maxLength={6}
                            />
                            <TextInput
                                onChangeText={text => this.setState({ latitude: text })}
                                style={{ borderWidth: 1, borderRadius: 10, height: 50, borderColor: '#E22727', marginTop: 15, paddingLeft: 10 }}
                                placeholder="Latitude"
                                placeholderTextColor="gray"
                                keyboardType="number-pad"
                            />
                            <TextInput
                                onChangeText={text => this.setState({ longitude: text })}
                                style={{ borderWidth: 1, borderRadius: 10, height: 50, borderColor: '#E22727', marginTop: 15, paddingLeft: 10 }}
                                placeholder="Longitude"
                                placeholderTextColor="gray"
                                keyboardType="number-pad"
                            />
                            <TouchableOpacity 
                                style={styles.button}
                                onPress={() => {
                                    this.AddAddressData();
                                }}
                            >
                                {this.state.loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <View >
                                        <Text style={styles.buttonText}>Add</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'red',
        padding: 100,
    },
    headerWrapper: {
        borderBottomColor: 'gray',
        borderBottomWidth: 2,
        marginBottom: 30,
    },
    header: {
        fontSize: 35,
        color: 'gray',
        marginBottom: 10,
    },
    signup: {
        marginTop: -11,
        alignSelf: 'center',
        fontSize: 15,
        color: '#8E8E8E',
        width: 90,
        backgroundColor: '#ffffff',
    },
    paddingview: {
        padding: 20,
    },
    box: {
        flexBasis: 75,
        borderWidth: 1,
        borderColor: 'black',
        height: 40,
        margin: 10,
    },
    forgetPass: {
        marginTop: 50,
        alignSelf: 'center',
        fontSize: 15,
        color: 'gray',
    },
    checkboxContainer: {
        marginTop: 25,
    },
    checklable: {
        borderRadius: 20,
        borderColor: 'gray',
    },
    button: {
        backgroundColor: '#db3236',
        padding: 12,
        borderRadius: 20,
        width: 220,
        marginTop: 20,
        alignSelf: 'center',
        marginBottom: 70
    },
    newbutton: {
        backgroundColor: '#db3236',
        padding: 5,
        borderRadius: 20,
        width: 180,
        marginTop: 30,
        alignSelf: 'center',
    },
    buttonText: {
        color: 'white',
        alignSelf: 'center',
        fontSize: 17
    },
    newbuttonText: {
        color: 'white',
        alignSelf: 'center',
        fontSize: 20,
    },
    tinyLogo: {
        width: 170,
        height: 100,
        resizeMode: 'stretch',
        marginLeft: 70,
        marginRight: 70,
        marginBottom: 50,
        marginTop: 50,
    },

    newOne: {
        width: 170,
        flex: 3,
    },
    newsignup: {
        fontSize: 15,
        color: 'gray',
    },
    dont: {
        fontSize: 14,
    },
    container: {
        backgroundColor: 'white',
        flex: 1,
        justifyContent: 'center',
    },
    newmodal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    cardonclick: {
        backgroundColor: 'pink',
    },
    cardnotclick: {
        backgroundColor: 'white',
    },
    modalInner: {
        height: 320,
        width: 320,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#FFF',
        shadowColor: '#000',
        borderRadius: 20,
        marginLeft: 40,
        marginRight: 40,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    text: {
        fontSize: 20,
        fontWeight: '700',
        color: 'black',
        marginTop: 11,
    },
    extinput: {
        marginTop: 193,
        fontSize: 15,
    },
    textinput: {
        marginTop: 16,
        fontSize: 15,
    },
    pickerContainer: {
        borderRadius: 5,
        height: 50,
        textAlign: 'center',
        color: 'red',
        fontSize: 18
      },
});
