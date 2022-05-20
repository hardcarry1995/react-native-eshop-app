import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';

export default class HireProduct extends React.Component {
  state = {
    modalVisible: false,
  };
  setModalVisible = visible => {
    this.setState({ modalVisible: visible });
  };

  render() {
    const { modalVisible } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ backgroundColor: 'white', flex: 1 }}>
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
                    style={{ marginTop: 20, fontWeight: 'bold', fontSize: 20 }}>
                    Order Placed Sucessfully
                  </Text>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => this.setModalVisible(!modalVisible)}>
                    <Text style={styles.textStyle}>Continue</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <View style={{ height: 1, backgroundColor: 'grey', marginVertical: 30, marginHorizontal: 20 }} />

            <Text style={{ top: -20, left: 20 }}>Select Method of Payment</Text>

            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View
                style={{
                  borderRadius: 8,
                  borderColor: '#DB3236',
                  borderWidth: 2,
                  height: 61,
                  width: 100,
                  marginLeft: 15,
                }}
              />

              <View
                style={{
                  borderRadius: 8,
                  borderColor: '#DB3236',
                  borderWidth: 2,
                  height: 61,
                  width: 100,
                  alignSelf: 'center',
                }}
              />

              <View
                style={{
                  borderRadius: 8,
                  borderColor: '#DB3236',
                  borderWidth: 2,
                  height: 61,
                  width: 100,
                  alignSelf: 'flex-end',
                  marginRight: 15,
                }}>
                <Image
                  style={{ width: 90, marginLeft: 2, marginRight: 2, top: 4 }}
                  source={require('../../assets/img/Payment.png')}
                />

                {/* <View style={{ height: 1, backgroundColor: 'grey', marginVertical: 30, marginHorizontal: 5, marginLeft:-242, marginRight:-13, opacity:0.3}} /> */}
              </View>
            </View>

            <View
              style={{
                height: 1,
                backgroundColor: 'grey',
                marginVertical: 30,
                marginHorizontal: 5,
                opacity: 0.3,
              }}
            />

            <View>
              <TextInput
                style={{
                  borderColor: '#F54D30',
                  borderWidth: 2,
                  borderRadius: 15,
                  marginRight: 15,
                  marginLeft: 15,
                  height: 45,
                }}
                placeholder="Enter Account Number"
              />

              <TextInput
                style={{
                  borderColor: '#F54D30',
                  color: '#A1A1A1',
                  borderWidth: 2,
                  borderRadius: 15,
                  marginRight: 15,
                  marginLeft: 15,
                  marginTop: 20,
                  height: 45,
                }}
                placeholder="Enter Verification Password"
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'flex-end',
                marginTop: 40,
              }}>
              <Text style={{}}>1 Item(s), Total:</Text>
              <Text style={{ marginRight: 20, color: '#DB3236' }}>$3500</Text>
              {/* <Text style={{alignSelf:"flex-end", marginRight:20,}}>Price dropped, Saved: $500</Text> */}
            </View>
            <Text style={{ alignSelf: 'flex-end', marginRight: 20 }}>
              Price dropped, Saved: $500
            </Text>

            <View
              style={{
                height: 1,
                backgroundColor: 'grey',
                marginHorizontal: 15,
                marginVertical: 10,
              }}
            />

            <View>
              <Text style={{ marginLeft: 17 }}>Subtotal (1 items)</Text>
              <Text style={{ marginLeft: 17 }}>Shipping Fee</Text>
              <Text
                style={{
                  bottom: 35,
                  color: '#DB3236',
                  alignSelf: 'flex-end',
                  marginRight: 22,
                }}>
                $3500
              </Text>
              <Text
                style={{
                  bottom: 35,
                  color: '#DB3236',
                  alignSelf: 'flex-end',
                  marginRight: 22,
                }}>
                $10
              </Text>
            </View>

            <View
              style={{
                backgroundColor: '#DB3236',
                height: 70,
                paddingTop: 7,
                marginTop: 35,
              }}>
              <Text style={{ fontSize: 20, color: '#FAFAFA', marginLeft: 15 }}>
                Total: $3510
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: '#E19191',
                  top: 3,
                  marginLeft: 15,
                }}>
                VAT included, where applicable
              </Text>

              <TouchableOpacity
                style={{
                  borderRadius: 10,
                  backgroundColor: '#FF7175',
                  height: 40,
                  width: 110,
                  alignSelf: 'flex-end',
                  marginTop: -35,
                  marginRight: 20,
                }}
                onPress={() => this.setModalVisible(true)}>
                <Text
                  style={{
                    fontSize: 15,
                    color: '#FAFAFA',
                    alignSelf: 'center',
                    marginTop: 8,
                  }}>
                  Pay
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    //   padding: 95,
    height: '55%',
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
    // padding: 10,
    // elevation: 2
    height: 40,
    width: 150,
    marginTop: 30,
  },
  buttonClose: {
    backgroundColor: '#9F1D20',
  },
  textStyle: {
    color: 'white',
    // fontWeight: "bold",
    // textAlign: "center",
    fontSize: 20,
    alignSelf: 'center',
    marginTop: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
