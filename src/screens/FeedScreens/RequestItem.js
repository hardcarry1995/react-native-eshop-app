import React from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

const Request = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, padding: 15 }}>
        <Text style={{ color: '#323232', fontSize: 18, fontWeight: '600' }}>
          Selected Category
        </Text>
        <Text
          style={{ color: '#323232', fontSize: 15, opacity: 0.5, marginTop: 10 }}>
          {'Category >Sub Category >Automotive'}
        </Text>
        <View
          style={{
            height: 1,
            backgroundColor: '#E9E9E9',
            width: '100%',
            marginTop: 10,
          }}
        />

        <Text style={{ color: '#323232', fontSize: 16, marginTop: 10 }}>
          Item Details
        </Text>
        <TextInput
          style={{
            borderColor: '#DEDEDE',
            borderWidth: 1,
            height: 40,
            borderRadius: 5,
            marginTop: 10,
          }}
          placeholder="Title"
          underlineColorAndroid="transparent"
        />
        <TextInput
          style={{
            borderColor: '#DEDEDE',
            borderWidth: 1,
            height: '20%',
            borderRadius: 5,
            marginTop: 10,
          }}
          placeholder="Description..."
          //   numberOfLines="5"
          underlineColorAndroid="transparent"
        />
        <View
          style={{
            height: 1,
            backgroundColor: '#E9E9E9',
            width: '100%',
            marginTop: 15,
          }}
        />

        <Text style={{ color: '#323232', fontSize: 18, marginTop: 10 }}>
          Schedule Appointment
        </Text>
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <View
            style={{
              height: 40,
              width: 150,
              borderRadius: 5,
              borderColor: '#DEDEDE',
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: 10,
            }}>
            <Text style={{}}>1/12/2020</Text>
          </View>

          <View
            style={{
              height: 40,
              width: 150,
              borderRadius: 5,
              borderColor: '#DEDEDE',
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text>7:00 AM</Text>
          </View>
        </View>

        <View
          style={{
            height: 1,
            backgroundColor: '#E9E9E9',
            width: '100%',
            marginTop: 10,
          }}
        />

        <View style={{ margin: 10, height: 150 }}>
          <View style={{ flexDirection: 'row' }}>
            <Image
              style={{
                height: 85,
                width: 70,
                resizeMode: 'center',
                marginLeft: 3,
              }}
              source={require('../../assets/Group92.png')}
            />
            {/* <Text style={{color:"#DB3236", marginLeft:4}}>UPLOAD IMAGE</Text> */}
            <View>
              <Image
                style={{
                  height: 75,
                  width: 60,
                  resizeMode: 'center',
                  marginLeft: 3,
                }}
                source={require('../../assets/uploadimg.png')}
              />
              <Text style={{ color: '#DB3236', fontSize: 10, marginTop: -13 }}>
                UPLOAD IMAGE
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <Image
              style={{
                height: 85,
                width: 70,
                resizeMode: 'center',
                marginLeft: 3,
              }}
              source={require('../../assets/Group89.png')}
            />
            {/* <Text style={{color:"#DB3236", marginLeft:4}}>UPLOAD IMAGE</Text> */}
            <Image
              style={{
                height: 85,
                width: 70,
                resizeMode: 'center',
                marginLeft: 3,
              }}
              source={require('../../assets/Group87.png')}
            />
            <Image
              style={{
                height: 85,
                width: 70,
                resizeMode: 'center',
                marginLeft: 3,
              }}
              source={require('../../assets/Group88.png')}
            />
            <View>
              <Image
                style={{
                  height: 55,
                  width: 50,
                  resizeMode: 'center',
                  marginLeft: 3,
                  marginTop: 6,
                }}
                source={require('../../assets/Group12.png')}
              />
              <Text style={{ color: '#DB3236', fontSize: 10 }}>UPLOAD IMAGE</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            height: 200,
            padding: 10,
            flexDirection: 'row',
            marginTop: '10%',
          }}>
          <TouchableOpacity
            style={{
              height: 35,
              width: 150,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: '#DE5246',
              marginHorizontal: 10,
            }}>
            <Text style={{ color: '#DE5246', margin: 5, marginLeft: 10 }}>
              SCAN LICENSE DISC
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              height: 35,
              width: 150,
              backgroundColor: '#DE5246',
              borderRadius: 5,
              borderWidth: 1,
              borderColor: '#DE5246',
            }}
            onPress={() => {
              navigation.navigate('MyRequest');
            }}>
            <Text style={{ color: '#FAFAFA', margin: 5, marginLeft: 10 }}>
              SUBMIT REQUEST
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Request;
