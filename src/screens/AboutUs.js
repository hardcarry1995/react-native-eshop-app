import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Alert,
  Dimensions,
  TouchableHighlight,
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from '@react-native-community/geolocation';
import client from '../constants/client';
const { width, height } = Dimensions.get('window');
import { SPECIAL_PRODUCT_LIST_WITH_DISTANCE } from '../constants/queries';
import { BottomSheet } from 'react-native-btr';
import Moment from 'moment';
import { imagePrefix } from '../constants/utils';
import HMSMap, { HMSMarker, HMSInfoWindow, MapTypes } from "@hmscore/react-native-hms-map";

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const Map33 = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentLatitude, setCurrentLatitude] = useState('');
  const [currentLongitude, setCurrentLongitude] = useState('');
  const [specialData, setSpecialData] = useState([]);
  const [selectedSpecialData, setSelectedSpecialData] = useState({});
  const [platformType, setPlatformType] = useState('');

  const getLocation = async () => {
    let token = (await AsyncStorage.getItem('userToken')) || '';
    Geolocation.getCurrentPosition(
      position => {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        setCurrentLatitude(latitude);
        setCurrentLongitude(longitude);
        fetchSpecialProduct(latitude, longitude, token);
      },
      error => {
        console.log(error.code, error.message);
        Alert.alert('Please on location', error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 100000,
      },
    );
  };

  const fetchSpecialProduct = (latitude, longitude, token) => {
    // console.log('ttkk', `Bearer ${bearerToken}`)
    const specialDistance = 100;
    client
      .query({
        query: SPECIAL_PRODUCT_LIST_WITH_DISTANCE,
        fetchPolicy: 'no-cache',
        variables: {
          distance: specialDistance,
        },
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      })
      .then(result => {
        if (result?.data?.getMstSpecialList?.success) {
          setSpecialData(result?.data?.getMstSpecialList.result);
        } else {
          // console.log(result.data.getMstSpecialList.message);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const renderMapView = () => {
    if (!currentLatitude) return <></>;
    return (
      platformType == 'huawie' ? <HMSMap camera={{ target: { latitude: 41, longitude: 29 }, zoom: 10 }}>
        <HMSMarker
          coordinate={{ latitude: 41, longitude: 29 }}
          onInfoWindowClose={(e) => console.log("HMSMarker onInfoWindowClose")}
        >
          <HMSInfoWindow>
            <TouchableHighlight
              onPress={(e) => console.log("HMSMarker onInfoWindowClick: ", e.nativeEvent)}
              onLongPress={(e) => console.log("HMSMarker onInfoWindowLongClick: ", e.nativeEvent)}
            >
              <View style={{ backgroundColor: "yellow" }}>
                <Text style={{ backgroundColor: "orange" }}>Hello</Text>
                <Text>I am a marker</Text>
              </View>
            </TouchableHighlight>
          </HMSInfoWindow>
        </HMSMarker>
      </HMSMap> :
        <MapView
          style={styles.mapStyle}
          initialRegion={{
            latitude: parseFloat(currentLatitude),
            longitude: parseFloat(currentLongitude),
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
          customMapStyle={mapStyle}>
          {specialData.length > 0 &&
            specialData.map((marker, index) => {
              let markerImage = '';
              if (marker.mapSpecialUpload.length > 0) {
                markerImage = marker.mapSpecialUpload[0].thumbNailPath;
                // console.log('imagege', imagege)
              } else {
                markerImage = '';
              }
              if (marker?.latitude && marker?.longitude) {
                return (
                  <Marker
                    key={index}
                    coordinate={{
                      latitude: parseFloat(
                        index == 1 ? currentLatitude : marker?.latitude,
                      ),
                      longitude: parseFloat(
                        index == 1 ? currentLongitude : marker?.longitude,
                      ),
                    }}
                    title={marker?.specialName}
                    description={marker?.specialDescription}
                    image={
                      markerImage
                        ? { uri: `${imagePrefix}${markerImage}` }
                        : require('../assets/NoImage.jpeg')
                    }>
                    <Callout
                      onPress={e => {
                        if (
                          e.nativeEvent.action ===
                          'marker-inside-overlay-press' ||
                          e.nativeEvent.action === 'callout-inside-press'
                        ) {
                          return;
                        }

                        setSelectedSpecialData(marker);
                        setModalVisible(!modalVisible);
                      }}>
                      <View>
                        <Text>{marker?.specialName}</Text>
                        <Text>{marker?.specialDescription}</Text>
                      </View>
                    </Callout>
                  </Marker>
                );
              } else {
                return <></>;
              }
            })}
        </MapView>
    );
  };

  const specialDataModal = () => {
    return (
      <BottomSheet
        visible={modalVisible}
        onBackButtonPress={() => {
          setModalVisible(!modalVisible);
        }}
        onBackdropPress={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
            <Image
              style={{
                height: 30,
                width: 20,
                resizeMode: 'center',
                marginTop: 30,
              }}
              source={require('../assets/Path662.png')}
            />
          </TouchableOpacity>

          <ScrollView contentContainerStyle={styles.main}>
            {/* <Image style={styles.image} source={require('../assets/img/Rectangle.png')}/> */}
            <Text style={styles.text}>{selectedSpecialData?.specialName}</Text>

            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: 'row',
                  paddingTop: 2,
                  paddingBottom: 20,
                  alignSelf: 'center',
                  height: 30,
                }}>
                <Image
                  style={{
                    width: 15,
                    height: 15,
                    marginLeft: 2,
                    marginRight: 2,
                  }}
                  source={require('../assets/stargold.png')}
                />
                <Image
                  style={{
                    width: 15,
                    height: 15,
                    marginLeft: 2,
                    marginRight: 2,
                  }}
                  source={require('../assets/stargold.png')}
                />
                <Image
                  style={{
                    width: 15,
                    height: 15,
                    marginLeft: 2,
                    marginRight: 2,
                  }}
                  source={require('../assets/stargold.png')}
                />
                <Image
                  style={{
                    width: 15,
                    height: 15,
                    marginLeft: 2,
                    marginRight: 2,
                  }}
                  source={require('../assets/stargold.png')}
                />
                <Image
                  style={{
                    width: 15,
                    height: 15,
                    marginLeft: 2,
                    marginRight: 2,
                  }}
                  source={require('../assets/stargold.png')}
                />
              </View>

              <Text
                style={{
                  color: '#A8A8A8',
                  fontSize: 11,
                  alignSelf: 'center',
                }}>
                {Moment(selectedSpecialData?.startDate).format('DD-MMM-YYYY')}
              </Text>
              <Text
                style={{
                  color: '#323232',
                  fontSize: 12,
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}>
                {selectedSpecialData?.specialDescription}
              </Text>
            </View>
          </ScrollView>

          {/* <TouchableOpacity
            style={{
              height: 35,
              width: 200,
              backgroundColor: '#9F1D20',
              alignSelf: 'center',
              marginTop: 25,
              borderRadius: 5,
            }}>
            <Text
              style={{
                alignSelf: 'center',
                marginTop: 8,
                color: '#FFFFFF',
                fontSize: 15,
              }}>
              View Specials
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              height: 35,
              width: 200,
              backgroundColor: '#9F1D20',
              alignSelf: 'center',
              marginTop: 25,
              borderRadius: 5,
            }}>
            <Text
              style={{
                alignSelf: 'center',
                marginTop: 8,
                color: '#FFFFFF',
                fontSize: 15,
              }}>
              Show Business
            </Text>
          </TouchableOpacity> */}
        </View>
      </BottomSheet>
    );
  };

  useEffect(() => {
    if (navigation.isFocused()) {
      getLocation();
    }
  }, [navigation.isFocused()]);

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        {specialDataModal()}
        <View style={{ height: '100%' }}>{renderMapView()}</View>

        {/* <TouchableOpacity
          style={{alignSelf: 'center'}}
          onPress={() => setModalVisible(!modalVisible)}>
          <Image
            style={{height: 30, width: 20, resizeMode: 'center', marginTop: -7}}
            source={require('../assets/Down.png')}
          />
        </TouchableOpacity> */}
      </SafeAreaView>
    </View>
  );
};

export default Map33;

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
    height: 200,
    alignItems: 'center',

    // padding:15
  },
  mapStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // padding:15
  },
  con: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // flexDirection:"row",
    padding: 2,
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
    height: '75%',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    //   padding: 95,
    height: '190%',
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    // justifyContent:"flex-end"
  },
  button: {
    borderRadius: 10,
    // padding: 10,
    // elevation: 2
    height: 40,
    width: 150,
    marginTop: 30,
  },
  buttonClose: {
    backgroundColor: '#9F1D20',
  },

  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  main: {
    borderRadius: 15,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    height: 64,
    width: 64,
    marginTop: -75,
    marginLeft: 10,
  },
  text: {
    color: '#323232',
    alignSelf: 'center',
    marginTop: 10,
    fontSize: 15,
    fontWeight: 'bold',
  },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#F54D30',
    height: 43,
    borderRadius: 5,
    margin: 15,
  },

  ImageStyle: {
    padding: 10,
    margin: 5,
    height: 20,
    width: 20,
    resizeMode: 'stretch',
    alignItems: 'center',
  },
  markerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(130,4,150, 0.9)',
  },
  ring: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(130,4,150, 0.3)',
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(130,4,150, 0.5)',
  },
});
