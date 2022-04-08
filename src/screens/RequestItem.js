import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity, ScrollView, ToastAndroid, Alert } from 'react-native';
import { GET_PROVINCE, GET_CITY, GET_SUBURB, GET_ALL_STATE, GET_ALL_CITY_NEW, GET_ALL_SUBURB } from '../constants/queries';
import client from '../constants/client';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import { PermissionsAndroid } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import RNPickerSelect from 'react-native-picker-select';
import CategorySelector from "../components/CategorySelector";

Geocoder.init("AIzaSyCNjKB84RyfVRuvuU8sCcQT6uWB_wVY03s") //rescue

const RequestItem = ({ navigation, route }) => {
  const [switchValue, setSwitchValue] = useState(false);
  const [province, setProvince] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [allSubs, setAllSubs] = useState([]);
  const [selectProvince, setSelectProvince] = useState(null);
  const [city, setCity] = useState([]);
  const [selectCity, setSelectCity] = useState(null);
  const [suburb, setSuburb] = useState([]);
  const [selectSub, setSelectSub] = useState(null);
  const [currentLatitude, setCurrentLatitude] = useState(-28.4793);
  const [currentLongitude, setCurrentLongitude] = useState(24.6727);
  const [locationStatus, setLocationStatus] = useState('');
  const [mapstate, setMapState] = useState('');
  const [initialRegion, setinitialRegion] = useState();
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [subCategoryName, setSubCategoryName] = useState('');

  const [mapRegion, setMapReson] = useState();
  const title = "";
  const desc = "";
  const startdate = "";
  const mapSpecialUpload = "";
  const mapRef = useRef(null);

  const toggleSwitch = value => {
    setSwitchValue(value);
    if (value == true) {
      getLocation();
      getLocationData();
      getOneTimeLocation();
    } else {
      setTheAllData();
      setSelectProvince('')
      setSelectCity('')
      setSelectSub('')
    }
  };

  useEffect(() => {
    fetchAllCity();
    fetchAllSub();
    fetchProvince();
    setTheAllData();
  }, []);

  const setTheAllData = () => {
    let initialRegion = {
      latitude: -28.4793,
      longitude: 24.6727,
      latitudeDelta: 0.1015,
      longitudeDelta: 0.10121,
    }
    setinitialRegion(initialRegion);
    let region = {
      latitude: -28.4793,
      longitude: 24.6727,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    }
    setMapReson(region);
  }

  const AddCreateFeed = () => {
    if(selectProvince == ''){
      Alert.alert('Error','Select Province/State ');
    }
    else if(selectCity == ''){
      Alert.alert('Error','Select City');
    }else if(selectSub == ''){
      Alert.alert('Error','Select Saburb');
    }else{
    navigation.navigate('CreateFeed', {
      categoryId: categoryId,
      subCategoryId: subCategoryId,
      subCategoryName: subCategoryName,
      province: selectProvince,
      city: selectCity,
      suburb: selectSub,
      title: title,
      desc: desc,
      startdate:startdate,
      mapSpecialUpload:mapSpecialUpload,
    });
  }
  }
  const getLocation = () => {
    Geolocation.getCurrentPosition((position) => {
      Geocoder.from(position.coords.latitude, position.coords.longitude).then(json => {
        var addressComponent = json.results[0].address_components;
        setMapState(addressComponent[3].long_name);
        const searchProvince = province.find((p) => p.provinceName === addressComponent[addressComponent.length-3].long_name);
        setSelectProvince(searchProvince ? searchProvince.provinceId : null);
        const searchCity = allCities.find((p) => p.cityName === addressComponent[addressComponent.length-4].long_name);
        setSelectCity(searchCity ? searchCity.cityId : null);
        const searchSub = allSubs.find((p) => p.suburbName === addressComponent[addressComponent.length-5].long_name);
        setSelectSub(searchSub ? searchSub.suburbId : null);
        
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

  const getLocationData = () => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        getOneTimeLocation();
        subscribeLocationLocation();
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
            getOneTimeLocation();
            subscribeLocationLocation();
          } else {
            setLocationStatus('Permission Denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };
    requestLocationPermission();
    return () => {
      Geolocation.clearWatch(watchID);
    };
  }
  const getOneTimeLocation = () => {
    setLocationStatus('Getting Location ...');
    Geolocation.getCurrentPosition(
      (position) => {
        setLocationStatus('You are Here');
        const vcurrentLongitude = parseFloat(position.coords.longitude);
        const vcurrentLatitude = parseFloat(position.coords.latitude);
        let initialRegion = {
          latitude: parseFloat(position.coords.latitude),
          longitude: parseFloat(position.coords.longitude),
          latitudeDelta: 0.1015,
          longitudeDelta: 0.10121,
        }
        setinitialRegion(initialRegion);

        let region = {
          latitude: parseFloat(position.coords.latitude),
          longitude: parseFloat(position.coords.longitude),
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }
        setMapReson(region);
        setCurrentLongitude(vcurrentLongitude);

        setCurrentLatitude(vcurrentLatitude);
      },
      (error) => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
      },
    );
  };

  const subscribeLocationLocation = () => {
    watchID = Geolocation.watchPosition(
      (position) => {
        setLocationStatus('You are Here');
        const tcurrentLongitude = parseFloat(position.coords.longitude);
        const tcurrentLatitude = parseFloat(position.coords.latitude);
        setCurrentLongitude(tcurrentLongitude);
        setCurrentLatitude(tcurrentLatitude);
      },
      (error) => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
      },
    );
  };

  const fetchProvince = async () => {
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
        if (result.data.getProvince.success) {
          const updateProvinces = result.data.getProvince.result.map((item ) => {
            return {
              ...item,
              label: item.provinceName,
              value: item.provinceId
            }
          })
          setProvince(updateProvinces);
        } else {
          ToastAndroid.show( result.data.getProvince.message, ToastAndroid.SHORT );
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const fetchCity = async id => {
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
          setCity(updatedCities);
        } else {
          ToastAndroid.show( result.data.getCityByProvince.message, ToastAndroid.SHORT );
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const fetchSuburb = async id => {
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
          setSuburb(updatedSuperb);
        } else {
          ToastAndroid.show( result.data.getSuburbByCity.message, ToastAndroid.SHORT );
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const setCategory = (categories) => {
    if(categories.length === 0) {
      setShowCategorySelector(false);
      return;
    }

    const category = categories[0];

    setCategoryId(category.parentCategoryId);
    setSubCategoryId(category.categoryId);
    setSubCategoryName(category.categoryName);
    setShowCategorySelector(false);

  }

  useEffect(() => {
    fetchCity(selectProvince);
  }, [selectProvince]);
  
  useEffect(() => {
    fetchSuburb(selectCity);
  }, [selectCity]);


  const fetchAllCity = async () => {
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
          setAllCities(result.data.getCity.result);
        } else {
        }
      })
      .catch(err => {
        console.log('err', err);
      });
  };
  const fetchAllSub = async () => {
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
          setAllSubs(result.data.getSuburb.result);
          //setAllSub(result.data.getSuburb.result);
        } else {
        }
      })
      .catch(err => {
        console.log(err);
      });
  };




  return (
    <View style={{ flex: 1}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.con}>
          <Switch
            onValueChange={toggleSwitch}
            value={switchValue}
          />
          <Text style={{ color: '#323232', padding: 15, fontSize: 15 }}>
            Set Location
          </Text>
        </View>
        <View style={{ height: 200, margin: 20, }}>
          <MapView
            style={styles.mapStyle}
            initialRegion={initialRegion}
            region={mapRegion}
            followUserLocation={true}
            ref={mapRef}
            zoomEnabled={true}
            showsUserLocation={true}
            customMapStyle={mapStyle}>
            <Marker
              draggable
              coordinate={mapRegion}
              title={'Current location'}
            />
          </MapView>
        </View>

        <TouchableOpacity style={styles.categorySelectorButton} onPress={() => setShowCategorySelector(true)}>
          <Text style={styles.categoryButtonText}>{ subCategoryName === "" ? `Select a category` : subCategoryName }</Text>
        </TouchableOpacity>

        <View style={{ borderRadius: 10,height: 50, paddingHorizontal: 20, marginTop: 10 }}>
          <RNPickerSelect
            value={selectProvince}
            onValueChange={(itemValue, itemIndex) => {
              setSelectProvince(itemValue);
            }}
            items={province}
            textInputProps={styles.pickerContainer}
            placeholder= {{ label: "Select a province...", value: null }}
          />
        </View>

        <View style={{ borderRadius: 10, paddingHorizontal: 20, marginTop : 10 }}>
          <RNPickerSelect
            value={selectCity}
            onValueChange={(itemValue, itemIndex) => {
              setSelectCity(itemValue);
            }}
            items={city}
            textInputProps={styles.pickerContainer}            
            placeholder= {{ label: "Select a city...", value: null }}
          />
        </View>

        <View style={{ borderRadius: 10, paddingHorizontal: 20, marginTop : 10 }}>
            <RNPickerSelect
              value={selectSub}
              onValueChange={(itemValue, itemIndex) => {
                setSelectSub(itemValue);
              }}
              items={suburb}
              textInputProps={styles.pickerContainer}
              placeholder= {{ label: "Select a sub...", value: null }}
          />
        </View>
        <TouchableOpacity
          style={{ height: 40, width: 150, backgroundColor: '#DE5246', justifyContent: 'center', alignItems: 'center', borderRadius: 5, marginTop: 10, alignSelf: 'center', marginBottom: 40 }}
          onPress={() => AddCreateFeed() }>
          <Text style={{ color: '#FAFAFA' }}> PROCEED </Text>
        </TouchableOpacity>
      </ScrollView>
      <CategorySelector visible={showCategorySelector} multiple={false} onDone={setCategory} />
    </View>
  );
};

export default RequestItem;

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

const styles = StyleSheet.create({
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
  pickerContainer: {
    borderRadius: 5,
    borderColor: '#DCDCDC',
    borderWidth: 2,
    height: 50,
    textAlign: 'center',
    color: 'red',
    fontSize: 18
  },
  categorySelectorButton : {
    borderRadius: 5, 
    borderColor: '#DBDBDB', 
    borderWidth: 2, 
    height: 50, 
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryButtonText : {
    textAlign: 'center',
    color: 'red',
    fontSize: 18
  }
});
