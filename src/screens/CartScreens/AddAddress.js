import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, Alert, Platform, ScrollView, TextInput, ActivityIndicator, ToastAndroid } from 'react-native';
import { ADD_ADDRESS, GET_PROVINCE, GET_CITY, GET_SUBURB, GET_ALL_CITY_NEW, GET_ALL_SUBURB } from '../../constants/queries';
import AsyncStorage from '@react-native-community/async-storage';
import client from '../../constants/client';
import moment from 'moment';
import RNPickerSelect from 'react-native-picker-select';
import Toast from "react-native-toast-message";
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import { PermissionsAndroid } from 'react-native';
import Loader from "../../components/loader";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getBrand } from 'react-native-device-info';
import HMSMap, { HMSMarker, MapTypes } from "@hmscore/react-native-hms-map";
import HMSLocation from "@hmscore/react-native-hms-location"


const mapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
];

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
			loading: false,
			setLocatin: false,
			initialRegion : {
				latitude: -28.4793,
				longitude: 24.6727,
				latitudeDelta: 0.1015,
				longitudeDelta: 0.10121,
			},
			mapRegion: {
				latitude: -28.4793,
				longitude: 24.6727,
				latitudeDelta: 0.0922,
				longitudeDelta: 0.0421
			},
			allCities : [],
			allSubs: []

		};
		this.mapRef = null;
  	this.isHuawei = getBrand() !== "HUAWEI";
	}
	async componentDidMount() {
		this.setState({ loading : true})
		await this.fetchProvince();
		await this.fetchAllCity();
		await this.fetchAllSub();
		this.setTheAllData();
		this.setState({ loading : false})

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
					const updateProvinces = result.data.getProvince.result.map((item) => {
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
							label: item.cityName,
							value: item.cityId
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
							label: item.suburbName,
							value: item.suburbId
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
					latitude: this.state.latitude.toString(),
					longitude: this.state.longitude.toString(),
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
					Toast.show({
						type: "success",
						text1: "Success",
						text2: result.data.postUserAddress.message,
					})
					this.props.navigation.goBack();
				} else {
					Toast.show({
						type: "error",
						text1: "Error!",
						text2: result.data.postUserAddress.message,
					})
				}
			})
			.catch(err => {
				this.setState({ loading: false });
				console.log('address', err);
				Toast.show({
					type: "error",
					text1: "Error!",
					text2: "Something went wrong!"
				})
			});
	}

	getLocation = () => {
    Geolocation.getCurrentPosition((position) => {
			const vcurrentLongitude = parseFloat(position.coords.longitude);
			const vcurrentLatitude = parseFloat(position.coords.latitude);
			let initialRegion = {
				latitude: parseFloat(position.coords.latitude),
				longitude: parseFloat(position.coords.longitude),
				latitudeDelta: 0.1015,
				longitudeDelta: 0.10121,
			}
			let region = {
				latitude: parseFloat(position.coords.latitude),
				longitude: parseFloat(position.coords.longitude),
				latitudeDelta: 0.0922,
				longitudeDelta: 0.0421
			}
			this.setState({
				initialRegion: initialRegion, 
				region: region,
				latitude: vcurrentLatitude,
				longitude: vcurrentLongitude,
			})
      Geocoder.from(position.coords.latitude, position.coords.longitude).then(json => {
        var addressComponent = json.results[0].address_components;
        // setMapState(addressComponent[3].long_name);
        const searchProvince = this.state.province.find((p) => p.provinceName === addressComponent[addressComponent.length-3].long_name);
        // setSelectProvince(searchProvince ? searchProvince.provinceId : null);
        const searchCity = this.state.allCities.find((p) => p.cityName === addressComponent[addressComponent.length-4].long_name);
        // setSelectCity(searchCity ? searchCity.cityId : null);
        const searchSub = this.state.allSubs.find((p) => p.suburbName === addressComponent[addressComponent.length-5].long_name);
        // setSelectSub(searchSub ? searchSub.suburbId : null);
				// const streetAddress = addressComponent
				const streetAddressNumberItem = addressComponent.find(f => f.types.includes("street_number"));
				const streetNumber = streetAddressNumberItem?.long_name;
				const streetAddressItem = addressComponent.find(f => f.types.includes("route"));
				const streetAddress = streetAddressItem?.long_name;
				const postalCodeItem =  addressComponent.find(f => f.types.includes("postal_code"));
				const postalCode = postalCodeItem?.long_name;
				this.setState({ 
					selectProvince: searchProvince ? searchProvince.provinceId : null,
					selectCity: searchCity ? searchCity.cityId : null,
					selectSub: searchSub ? searchSub.suburbId : null,
					streetAddress : `${streetAddress} ${streetNumber}`,
					zipcode : postalCode

				})
      }).catch(error => console.warn(error));
    }, (error) => {
      console.log(error.code, error.message);
      Alert.alert('Please on location',error.message)
    },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 100000
      });
  }

  getLocationData = () => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        this.getLocation();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            this.getLocation();
          } else {
            // setLocationStatus('Permission Denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };
    requestLocationPermission();
  }

	setTheAllData = () => {
    let initialRegion = {
      latitude: -28.4793,
      longitude: 24.6727,
      latitudeDelta: 0.1015,
      longitudeDelta: 0.10121,
    }
    // setinitialRegion(initialRegion);
    let region = {
      latitude: -28.4793,
      longitude: 24.6727,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    }
		this.setState({ initialRegion: initialRegion, mapRegion : region });
  }
  toggleSwitch = value => {
		this.setState({ setLocatin : value})
    if (value == true) {
      this.getLocationData();
    } else {
      this.setTheAllData();
			this.setState({
				selectProvince: '',
				selectSub: '',
				selectCity: '',
				latitude: '',
				longitude: '',
				streetAddress: '',
				zipcode: '',
			})
    }
  };

	fetchAllCity = async () => {
    let token = await AsyncStorage.getItem('userToken');
    client
      .query({
        query: GET_ALL_CITY_NEW,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      })
      .then(async result => {
        if (result.data.getCity.success) {
					const updatedCities = result.data.getCity.result.map(item => {
						return {
							...item,
							label: item.cityName,
							value: item.cityId
						}
					})
					this.setState({
						allCities: updatedCities
					})
        } else {
        }
      })
      .catch(err => {
        console.log('err', err);
      });
  };
  fetchAllSub = async () => {
    let token = await AsyncStorage.getItem('userToken');
    client
      .query({
        query: GET_ALL_SUBURB,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Length': 0,
          },
        },
      })
      .then(async result => {
        if (result.data.getSuburb.success) {
          // setAllSubs(result.data.getSuburb.result);
          //setAllSub(result.data.getSuburb.result);
					const updatedSuperb = result.data.getSuburb.result.map(item => {
						return {
							...item,
							label: item.suburbName,
							value: item.suburbId
						}
					})
					this.setState({ allSubs: updatedSuperb})
        } else {
        }
      })
      .catch(err => {
        console.log(err);
      });
  };



	render() {
		if(this.state.loading){
			return <Loader  />
		}
		return (
			<KeyboardAwareScrollView>
				<View style={{ backgroundColor: 'white', flex: 1 }}>
					<View style={styles.con}>
						{!this.isHuawei && <Switch
							onValueChange={(value) => this.toggleSwitch(value)}
							value={this.state.setLocatin}
						/> }
						<Text style={{ color: '#323232', padding: 15, fontSize: 15 }}>
							Set Location
						</Text>
					</View>
					<View style={{ height: 200, margin: 20, }}>
						{this.isHuawei ? <HMSMap 
              camera={{
                target: { latitude: this.state.mapRegion.latitude, longitude: this.state.mapRegion.longitude, },
                zoom: 11,
              }}
              mapType={MapTypes.NORMAL}
              minZoomPreference={1}
              maxZoomPreference={24}
              rotateGesturesEnabled={true}
              tiltGesturesEnabled={true}
              zoomControlsEnabled={true}
              zoomGesturesEnabled={true}
              mapStyle={
                '[{"mapFeature":"all","options":"labels.icon","paint":{"icon-type":"night"}}]'
              }
              myLocationEnabled={true}
              markerClustering={true}
              myLocationButtonEnabled={true}
              scrollGesturesEnabledDuringRotateOrZoom={true}
              onMapReady={(e) => console.log("HMSMap onMapReady: ", e.nativeEvent)}
              onMapClick={(e) => console.log("HMSMap onMapClick: ", e.nativeEvent)}
              onMapLoaded={(e) => console.log("HMSMap onMapLoaded: ", e.nativeEvent)}
            >
              <HMSMarker
                  coordinate={{ latitude: this.state.mapRegion.latitude, longitude: this.state.mapRegion.longitude }}
                  onInfoWindowClose={(e) => console.log("HMSMarker onInfoWindowClose")}
                ></HMSMarker>
            </HMSMap> 
						: <MapView
							style={styles.mapStyle}
							initialRegion={this.state.initialRegion}
							region={this.state.mapRegion}
							followUserLocation={true}
							ref={this.mapRef}
							zoomEnabled={true}
							showsUserLocation={true}
							customMapStyle={mapStyle}>
							<Marker
								draggable
								coordinate={this.state.mapRegion}
								title={'Current location'}
							/>
          </MapView> }
        </View>
					<View style={{ marginTop: 2 }}>
						<View style={styles.paddingview}>
							<View style={styles.pickerButtonContainer}>
								<RNPickerSelect
									value={this.state.selectProvince}
									onValueChange={(itemValue, itemIndex) => {
										this.setState({ selectProvince: itemValue })
										if(!this.state.setLocatin)
											this.fetchCity(itemValue);
									}}
									items={this.state.province}
									textInputProps={{ style: styles.pickerContainer, multiline: false }}
									placeholder={{ label: "Select a province...", value: null }}
								/>
							</View>

							<View style={styles.pickerButtonContainer}>
								<RNPickerSelect
									value={this.state.selectCity}
									onValueChange={(itemValue, itemIndex) => {
										this.setState({ selectCity: itemValue })
										if(!this.state.setLocatin) this.fetchSuburb(itemValue);
									}}
									items={this.state.setLocatin ? this.state.allCities : this.state.city}
									textInputProps={{ style: styles.pickerContainer,  multiline: false  }}
									placeholder={{ label: "Select a city...", value: null }}
								/>
							</View>

							<View style={styles.pickerButtonContainer}>
								<RNPickerSelect
									value={this.state.selectSub}
									onValueChange={(itemValue, itemIndex) => {
										this.setState({ selectSub: itemValue })
									}}
									items={this.state.setLocatin ? this.state.allSubs :  this.state.suburb}
									textInputProps={{ style: styles.pickerContainer, numberOfLines: 1 }}
									placeholder={{ label: "Select a sub...", value: null }}
								/>
							</View>

							<TextInput
								onChangeText={text => this.setState({ streetAddress: text })}
								style={{ borderWidth: 1, borderRadius: 10, height: 50, borderColor: '#E22727', marginTop: 15, paddingLeft: 10 }}
								placeholder="Street Address"
								placeholderTextColor="gray"
								value={this.state.streetAddress}
							/>
							<TextInput
								onChangeText={text => this.setState({ zipcode: text })}
								style={{ borderWidth: 1, borderRadius: 10, height: 50, borderColor: '#E22727', marginTop: 15, paddingLeft: 10 }}
								placeholder="Zipcode"
								placeholderTextColor="gray"
								keyboardType="number-pad"
								maxLength={6}
								value={this.state.zipcode}
							/>
							<TextInput
								onChangeText={text => this.setState({ latitude: text })}
								style={{ borderWidth: 1, borderRadius: 10, height: 50, borderColor: '#E22727', marginTop: 15, paddingLeft: 10 }}
								placeholder="Latitude"
								placeholderTextColor="gray"
								keyboardType="number-pad"
								value={this.state.latitude.toString()}

							/>
							<TextInput
								onChangeText={text => this.setState({ longitude: text })}
								style={{ borderWidth: 1, borderRadius: 10, height: 50, borderColor: '#E22727', marginTop: 15, paddingLeft: 10 }}
								placeholder="Longitude"
								placeholderTextColor="gray"
								keyboardType="number-pad"
								value={this.state.longitude.toString()}
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
			</KeyboardAwareScrollView>
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
		textAlign: 'center',
		color: 'red',
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 18
	},
	mapStyle: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'white'
	},
	con: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: 20
	},
	pickerButtonContainer: { 
		borderRadius: 10, 
		borderColor: '#E22727', 
		borderWidth: 1, 
		height: 50, 
		marginTop: 15, 
		justifyContent: "center", 
		alignItems: "center"
	}
});
