import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
} from 'react-native';

const MyRequest = ({ navigation }) => {
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ backgroundColor: 'white' }}>
          <View style={styles.SectionStyle}>
            <Image
              source={require('../../assets/search.png')}
              style={styles.ImageStyle}
            />

            <TextInput
              style={{ flex: 1 }}
              placeholder="Search for a business"
              underlineColorAndroid="transparent"
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Request25');
            }}
            activeOpacity={0.9}>
            <View style={styles.main}>
              <View>
                <View
                  style={{
                    width: 1,
                    height: 80,
                    backgroundColor: '#D0D0D0',
                    marginLeft: 87,
                    marginTop: 10,
                  }}
                />
                <Image
                  style={styles.image}
                  source={require('../../assets/R25.png')}
                />
              </View>
              <View>
                <Text style={styles.text}>Get a Free Bosch Go Cordless</Text>

                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    paddingTop: 5,
                    paddingBottom: 20,
                  }}>
                  <Image
                    style={{
                      width: 15,
                      height: 15,
                      marginLeft: 110,
                      marginRight: 2,
                      bottom: 70,
                    }}
                    source={require('../../assets/stargold.png')}
                  />
                  <Image
                    style={{
                      width: 15,
                      height: 15,
                      marginLeft: 2,
                      marginRight: 2,
                      bottom: 70,
                    }}
                    source={require('../../assets/stargold.png')}
                  />
                  <Image
                    style={{
                      width: 15,
                      height: 15,
                      marginLeft: 2,
                      marginRight: 2,
                      bottom: 70,
                    }}
                    source={require('../../assets/stargold.png')}
                  />
                  <Image
                    style={{
                      width: 15,
                      height: 15,
                      marginLeft: 2,
                      marginRight: 2,
                      bottom: 70,
                    }}
                    source={require('../../assets/stargold.png')}
                  />
                  <Image
                    style={{
                      width: 15,
                      height: 15,
                      marginLeft: 2,
                      marginRight: 2,
                      bottom: 70,
                    }}
                    source={require('../../assets/stargold.png')}
                  />
                </View>

                <Text
                  style={{
                    marginLeft: 110,
                    bottom: 70,
                    color: '#A8A8A8',
                    fontSize: 11,
                  }}>
                  15-April-2019
                </Text>
                <Text
                  style={{
                    marginLeft: 110,
                    bottom: 65,
                    color: '#323232',
                    fontSize: 11,
                  }}>
                  1Get the best service from us
                </Text>
              </View>
              <Image
                style={{
                  width: 15,
                  height: 15,
                  marginRight: 15,
                  bottom: 105,
                  alignSelf: 'flex-end',
                }}
                source={require('../../assets/Pat111.png')}
              />
            </View>
          </TouchableOpacity>

          <View style={styles.main}>
            <View>
              <View
                style={{
                  width: 1,
                  height: 80,
                  backgroundColor: '#D0D0D0',
                  marginLeft: 87,
                  marginTop: 10,
                }}
              />
              <Image
                style={styles.image}
                source={require('../../assets/R25.png')}
              />
            </View>
            <View>
              <Text style={styles.text}>Get a Free Bosch Go Cordless</Text>

              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  paddingTop: 5,
                  paddingBottom: 20,
                }}>
                <Image
                  style={{
                    width: 15,
                    height: 15,
                    marginLeft: 110,
                    marginRight: 2,
                    bottom: 70,
                  }}
                  source={require('../../assets/stargold.png')}
                />
                <Image
                  style={{
                    width: 15,
                    height: 15,
                    marginLeft: 2,
                    marginRight: 2,
                    bottom: 70,
                  }}
                  source={require('../../assets/stargold.png')}
                />
                <Image
                  style={{
                    width: 15,
                    height: 15,
                    marginLeft: 2,
                    marginRight: 2,
                    bottom: 70,
                  }}
                  source={require('../../assets/stargold.png')}
                />
                <Image
                  style={{
                    width: 15,
                    height: 15,
                    marginLeft: 2,
                    marginRight: 2,
                    bottom: 70,
                  }}
                  source={require('../../assets/stargold.png')}
                />
                <Image
                  style={{
                    width: 15,
                    height: 15,
                    marginLeft: 2,
                    marginRight: 2,
                    bottom: 70,
                  }}
                  source={require('../../assets/stargold.png')}
                />
              </View>

              <Text
                style={{
                  marginLeft: 110,
                  bottom: 70,
                  color: '#A8A8A8',
                  fontSize: 11,
                }}>
                15-April-2019
              </Text>
              <Text
                style={{
                  marginLeft: 110,
                  bottom: 65,
                  color: '#323232',
                  fontSize: 11,
                }}>
                1Get the best service from us
              </Text>
            </View>
            <Image
              style={{
                width: 15,
                height: 15,
                marginRight: 15,
                bottom: 105,
                alignSelf: 'flex-end',
              }}
              source={require('../../assets/Pat111.png')}
            />
          </View>

          <View style={styles.main}>
            <View>
              <View
                style={{
                  width: 1,
                  height: 80,
                  backgroundColor: '#D0D0D0',
                  marginLeft: 87,
                  marginTop: 10,
                }}
              />
              <Image
                style={styles.image}
                source={require('../../assets/R25.png')}
              />
            </View>
            <View>
              <Text style={styles.text}>Get a Free Bosch Go Cordless</Text>

              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  paddingTop: 5,
                  paddingBottom: 20,
                }}>
                <Image
                  style={{
                    width: 15,
                    height: 15,
                    marginLeft: 110,
                    marginRight: 2,
                    bottom: 70,
                  }}
                  source={require('../../assets/stargold.png')}
                />
                <Image
                  style={{
                    width: 15,
                    height: 15,
                    marginLeft: 2,
                    marginRight: 2,
                    bottom: 70,
                  }}
                  source={require('../../assets/stargold.png')}
                />
                <Image
                  style={{
                    width: 15,
                    height: 15,
                    marginLeft: 2,
                    marginRight: 2,
                    bottom: 70,
                  }}
                  source={require('../../assets/stargold.png')}
                />
                <Image
                  style={{
                    width: 15,
                    height: 15,
                    marginLeft: 2,
                    marginRight: 2,
                    bottom: 70,
                  }}
                  source={require('../../assets/stargold.png')}
                />
                <Image
                  style={{
                    width: 15,
                    height: 15,
                    marginLeft: 2,
                    marginRight: 2,
                    bottom: 70,
                  }}
                  source={require('../../assets/stargold.png')}
                />
              </View>

              <Text
                style={{
                  marginLeft: 110,
                  bottom: 70,
                  color: '#A8A8A8',
                  fontSize: 11,
                }}>
                15-April-2019
              </Text>
              <Text
                style={{
                  marginLeft: 110,
                  bottom: 65,
                  color: '#323232',
                  fontSize: 11,
                }}>
                1Get the best service from us
              </Text>
            </View>
            <Image
              style={{
                width: 15,
                height: 15,
                marginRight: 15,
                bottom: 105,
                alignSelf: 'flex-end',
              }}
              source={require('../../assets/Pat111.png')}
            />
          </View>

          <View style={styles.main}>
            <View>
              <View
                style={{
                  width: 1,
                  height: 80,
                  backgroundColor: '#D0D0D0',
                  marginLeft: 87,
                  marginTop: 10,
                }}
              />
              <Image
                style={styles.image}
                source={require('../../assets/R25.png')}
              />
            </View>
            <View>
              <Text style={styles.text}>Get a Free Bosch Go Cordless</Text>

              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  paddingTop: 5,
                  paddingBottom: 20,
                }}>
                <Image
                  style={{
                    width: 15,
                    height: 15,
                    marginLeft: 110,
                    marginRight: 2,
                    bottom: 70,
                  }}
                  source={require('../../assets/stargold.png')}
                />
                <Image
                  style={{
                    width: 15,
                    height: 15,
                    marginLeft: 2,
                    marginRight: 2,
                    bottom: 70,
                  }}
                  source={require('../../assets/stargold.png')}
                />
                <Image
                  style={{
                    width: 15,
                    height: 15,
                    marginLeft: 2,
                    marginRight: 2,
                    bottom: 70,
                  }}
                  source={require('../../assets/stargold.png')}
                />
                <Image
                  style={{
                    width: 15,
                    height: 15,
                    marginLeft: 2,
                    marginRight: 2,
                    bottom: 70,
                  }}
                  source={require('../../assets/stargold.png')}
                />
                <Image
                  style={{
                    width: 15,
                    height: 15,
                    marginLeft: 2,
                    marginRight: 2,
                    bottom: 70,
                  }}
                  source={require('../../assets/stargold.png')}
                />
              </View>

              <Text
                style={{
                  marginLeft: 110,
                  bottom: 70,
                  color: '#A8A8A8',
                  fontSize: 11,
                }}>
                15-April-2019
              </Text>
              <Text
                style={{
                  marginLeft: 110,
                  bottom: 65,
                  color: '#323232',
                  fontSize: 11,
                }}>
                1Get the best service from us
              </Text>
            </View>
            <Image
              style={{
                width: 15,
                height: 15,
                marginRight: 15,
                bottom: 105,
                alignSelf: 'flex-end',
              }}
              source={require('../../assets/Pat111.png')}
            />
          </View>

          <View style={styles.main}>
            <View>
              <View
                style={{
                  width: 1,
                  height: 80,
                  backgroundColor: '#D0D0D0',
                  marginLeft: 87,
                  marginTop: 10,
                }}
              />
              <Image
                style={styles.image}
                source={require('../../assets/R25.png')}
              />
            </View>
            <View>
              <Text style={styles.text}>Get a Free Bosch Go Cordless</Text>

              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  paddingTop: 5,
                  paddingBottom: 20,
                }}>
                <Image
                  style={{
                    width: 15,
                    height: 15,
                    marginLeft: 110,
                    marginRight: 2,
                    bottom: 70,
                  }}
                  source={require('../../assets/stargold.png')}
                />
                <Image
                  style={{
                    width: 15,
                    height: 15,
                    marginLeft: 2,
                    marginRight: 2,
                    bottom: 70,
                  }}
                  source={require('../../assets/stargold.png')}
                />
                <Image
                  style={{
                    width: 15,
                    height: 15,
                    marginLeft: 2,
                    marginRight: 2,
                    bottom: 70,
                  }}
                  source={require('../../assets/stargold.png')}
                />
                <Image
                  style={{
                    width: 15,
                    height: 15,
                    marginLeft: 2,
                    marginRight: 2,
                    bottom: 70,
                  }}
                  source={require('../../assets/stargold.png')}
                />
                <Image
                  style={{
                    width: 15,
                    height: 15,
                    marginLeft: 2,
                    marginRight: 2,
                    bottom: 70,
                  }}
                  source={require('../../assets/stargold.png')}
                />
              </View>

              <Text
                style={{
                  marginLeft: 110,
                  bottom: 70,
                  color: '#A8A8A8',
                  fontSize: 11,
                }}>
                15-April-2019
              </Text>
              <Text
                style={{
                  marginLeft: 110,
                  bottom: 65,
                  color: '#323232',
                  fontSize: 11,
                }}>
                1Get the best service from us
              </Text>
            </View>
            <Image
              style={{
                width: 15,
                height: 15,
                marginRight: 15,
                bottom: 105,
                alignSelf: 'flex-end',
              }}
              source={require('../../assets/Pat111.png')}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: {
    height: 100,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowRadius: 20,
    elevation: 8,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 20,
  },
  image: {
    height: 64,
    width: 64,
    marginTop: -75,
    marginLeft: 10,
  },
  text: {
    marginLeft: 110,
    bottom: 70,
    color: '#323232',
  },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#959595',
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
});

export default MyRequest;
