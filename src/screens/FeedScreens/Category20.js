import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import { GET_PROVINCE, GET_CITY, GET_SUBURB, GET_ALL_STATE, GET_ALL_CITY_NEW, GET_ALL_SUBURB } from '../../constants/queries';
import client from '../../constants/client';
import AsyncStorage from '@react-native-community/async-storage';
import { Picker } from '@react-native-picker/picker';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import { PermissionsAndroid } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Alert } from 'react-native';

Geocoder.init("AIzaSyCNjKB84RyfVRuvuU8sCcQT6uWB_wVY03s") //rescue
// Geocoder.init("AIzaSyAvukcrpCKkgUIErLyg-4VOv23KMj_3o3c")


const Map20 = ({ navigation }) => {
  const [switchValue, setSwitchValue] = useState(false);
  const [province, setProvince] = useState([]);
  const [selectProvince, setSelectProvince] = useState('');
  const [city, setCity] = useState([]);
  const [selectCity, setSelectCity] = useState('');
  const [suburb, setSuburb] = useState([]);
  const [selectSub, setSelectSub] = useState('');
  const [currentLatitude, setCurrentLatitude] = useState(-28.4793);
  const [currentLongitude, setCurrentLongitude] = useState(24.6727);
  const [locationStatus, setLocationStatus] = useState('');
  const [coordinates, setCurrentcoordinates] = useState([]);
  const [mapstate, setMapState] = useState('');
  const [data, setData] = useState([]);
  const [dataEMP, setAllProvince] = useState([]);
  const [username, setQuery] = useState('');
  const [initialRegion, setinitialRegion] = useState([]);
  const [mapRegion, setMapReson] = useState([]);
  const categoryId = navigation.getParam('categoryId');
  const subCategoryId = navigation.getParam('subCategoryId');
  const subCategoryName = navigation.getParam('subCategoryName');
  const title = navigation.getParam('title', '');
  const desc = navigation.getParam('desc', '');
  const startdate = navigation.getParam('startdate', '');
  const mapSpecialUpload = navigation.getParam('mapSpecialUpload', []);
  const mapRef = useRef(null);
  // initialRegion
  // let categoryId = navigation.getParam('categoryId');

  const toggleSwitch = value => {
    setSwitchValue(value);
    console.log(value);
    if (value == true) {
      getLocation();
      getLocationData();
      getOneTimeLocation();
      handleSearch('Free State');
    } else {
      setTheAllData();
      setSelectProvince('')
      setSelectCity('')
      setSelectSub('')
    }
  };

  useEffect(() => {
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

  const handleSearch = text => {
    console.log('vdata', 'vdata')
    let vdata = dataEMP.filter(i =>
      i.provinceName.toLowerCase().includes(text.toLowerCase()))
    console.log('vdata', vdata[0].provinceId)
    // setData(vdata);
    // setQuery(text);
  };
  const AddCreateFeed = () => {
    console.log('selectProvince', selectProvince);
    if (selectProvince == '') {
      Alert.alert('Error', 'Select Province/State ');
    }
    else if (selectCity == '') {
      Alert.alert('Error', 'Select City');
    } else if (selectSub == '') {
      Alert.alert('Error', 'Select Saburb');
    } else {
      console.log('subCategoryId', subCategoryId);
      navigation.navigate('CreateFeed', {
        categoryId: categoryId,
        subCategoryId: subCategoryId,
        subCategoryName: subCategoryName,
        province: selectProvince,
        city: selectCity,
        suburb: selectSub,
        title: title,
        desc: desc,
        startdate: startdate,
        mapSpecialUpload: mapSpecialUpload,
      });
    }
  }
  const getLocation = () => {
    Geolocation.getCurrentPosition((position) => {
      console.log('position---------------------------------------------------', position);
      Geocoder.from(position.coords.latitude, position.coords.longitude).then(json => {
        console.log('json-----------------------------------------------', json);
        var addressComponent = json.results[0].address_components;
        setMapState(addressComponent[3].long_name);
        console.log('addressComponent', addressComponent);
        setSelectProvince(addressComponent[addressComponent.length - 3].long_name)
        setSelectCity(addressComponent[addressComponent.length - 4].long_name)
        setSelectSub(addressComponent[addressComponent.length - 5].long_name)
      }).catch(error => console.warn(error));
    }, (error) => {
      console.log(error.code, error.message);
      Alert.alert('Please on location', error.message)
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
      //Will give you the current location
      (position) => {
        setLocationStatus('You are Here');


        //getting the Longitude from the location json
        const vcurrentLongitude =
          parseFloat(position.coords.longitude);

        //getting the Latitude from the location json
        const vcurrentLatitude =
          parseFloat(position.coords.latitude);
        //Setting Longitude state
        //  setCurrentcoordinates.concat({
        //   latitude: position.coords.latitude,
        //   longitude: position.coords.longitude
        // })
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

        //Setting Longitude state
        setCurrentLatitude(vcurrentLatitude);
      },
      (error) => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        // maximumAge: 1000
      },
    );
  };

  const subscribeLocationLocation = () => {
    watchID = Geolocation.watchPosition(
      (position) => {
        //Will give you the location on location change

        setLocationStatus('You are Here');
        console.log(position);

        //getting the Longitude from the location json        
        const tcurrentLongitude =
          parseFloat(position.coords.longitude);

        //getting the Latitude from the location json
        const tcurrentLatitude =
          parseFloat(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(tcurrentLongitude);

        //Setting Latitude state
        setCurrentLatitude(tcurrentLatitude);
      },
      (error) => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        // maximumAge: 1000
      },
    );
  };
  const fetchAllState = async () => {
    let token = await AsyncStorage.getItem('userToken');
    client
      .query({
        query: GET_ALL_STATE,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
            // 'Content-Length': 0,
          },
        },
      })
      .then(async result => {
        console.log('GET_ALL_STATE', result.data.getProvince.result);
        if (result.data.getProvince.success) {
          fetchAllCity(token);
          setAllProvince(result.data.getProvince.result);
        } else {
        }
      })
      .catch(err => {
        console.log('err', err);
      });
  };
  const fetchAllCity = async (token) => {
    console.log('bearerToken', token);
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
        // console.log('GET_ALL_CITY_NEW',result.data.getCity.result);
        if (result.data.getCity.success) {
          fetchAllSub();
          //setAllCity(result.data.getCity.result);
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
        // console.log('GET_ALL_SUBURB ',result.data.getSuburb.result);
        if (result.data.getSuburb.success) {
          //setAllSub(result.data.getSuburb.result);
        } else {
        }
      })
      .catch(err => {
        console.log(err);
      });
  };


  const fetchProvince = async () => {
    let token = await AsyncStorage.getItem('userToken');
    client
      .query({
        query: GET_PROVINCE,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
            // 'Content-Length': 0,
          },
        },
      })
      .then(async result => {
        if (result.data.getProvince.success) {
          fetchAllState();
          setProvince(result.data.getProvince.result);
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
            // 'Content-Length': 0,
          },
        },
        variables: {
          id: Number(id),
        },
      })
      .then(async result => {
        console.log(result);
        if (result.data.getCityByProvince.success) {
          setCity(result.data.getCityByProvince.result);
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

  const fetchSuburb = async id => {
    if (id === '') {
      return;
    }
    console.log('fetchSuburb');
    let token = await AsyncStorage.getItem('userToken');
    client
      .query({
        query: GET_SUBURB,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
            // 'Content-Length': 0,
          },
        },
        variables: {
          id: Number(id),
        },
      })
      .then(async result => {
        console.log(result);
        if (result.data.getSuburbByCity.success) {
          setSuburb(result.data.getSuburbByCity.result);
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

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <View style={styles.con}>
          <Text style={{ color: '#323232', padding: 15, fontSize: 15 }}>
            Set Location
          </Text>

          <Switch
            style={{ marginTop: -35, marginRight: 10 }}
            onValueChange={toggleSwitch}
            value={switchValue}
          />
        </View>
        <View
          style={{
            backgroundColor: 'red',
            height: '35%',
            margin: 20,
          }}>
          {/* <View style={styles.container}> */}
          <MapView
            style={styles.mapStyle}
            // minZoomLevel={2}  // default => 0
            // maxZoomLevel={20} // default => 20
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
            // description={'This is a description of the marker'}
            />
          </MapView>
        </View>
        <View
          style={{
            borderRadius: 10,
            borderColor: '#DBDBDB',
            borderWidth: 1,
            height: 50,
            width: '90%',
            alignSelf: 'center',
            margin: 20,
          }}>
          <Picker
            selectedValue={selectProvince}
            onValueChange={(itemValue, itemIndex) => {
              setSelectProvince(itemValue);
              fetchCity(itemValue);
            }}
            style={{ color: '#6D6B6B', height: 45 }}>
            <Picker.Item label={selectProvince} value="5" />
            <Picker.Item label="Select Province/State" value="" />
            {/* <Picker.Item label={mapstate} value="" /> */}
            {province.map((item, i) => {
              return (
                <Picker.Item
                  key={i}
                  label={item.provinceName}
                  value={item.provinceId}
                />
              );
            })}
          </Picker>
        </View>

        <View
          style={{
            borderRadius: 10,
            borderColor: '#DBDBDB',
            borderWidth: 1,
            width: '90%',
            alignSelf: 'center',
            margin: 5,
          }}>
          <Picker
            selectedValue={selectCity}
            onValueChange={(itemValue, itemIndex) => {
              setSelectCity(itemValue);
              fetchSuburb(itemValue);
            }}
            style={{ color: '#6D6B6B', height: 45 }}>
            <Picker.Item label={selectCity} value="25" />
            <Picker.Item label="Select City" value="" />
            {city.map((item, i) => {
              return <Picker.Item label={item.cityName} value={item.cityId} />;
            })}
          </Picker>
        </View>

        <View
          style={{
            borderRadius: 10,
            borderColor: '#DBDBDB',
            borderWidth: 1,
            width: '90%',
            alignSelf: 'center',
            margin: 15,
          }}>
          <Picker
            selectedValue={selectSub}
            onValueChange={(itemValue, itemIndex) => {
              setSelectSub(itemValue);
            }}
            style={{ color: '#6D6B6B', height: 45 }}>
            <Picker.Item label={selectSub} value="125" />
            <Picker.Item label="Select Suburb" value="" />
            {suburb.map((item, i) => {
              return (
                <Picker.Item label={item.suburbName} value={item.suburbId} />
              );
            })}
          </Picker>
        </View>

        <TouchableOpacity
          style={{
            height: 35,
            width: 150,
            backgroundColor: '#DE5246',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#DE5246',
            alignSelf: 'center',
          }}
          onPress={() => {
            AddCreateFeed()
          }}>
          <Text style={{ color: '#FAFAFA', alignSelf: 'center', marginTop: 7 }}>
            PROCEED
          </Text>
        </TouchableOpacity>

        {/* </View> */}
      </ScrollView>
    </View>
  );
};

export default Map20;

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
  container: {
    position: 'absolute',
    top: 60,
    marginLeft: 16,
    bottom: 10,
    width: '90%',
    // height: 200,
    alignItems: 'center',

    // padding:15
  },
  mapStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white'
    // padding:15
  },
  con: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // flexDirection:"row",
    padding: 2,
  },
});
