import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

const QRCode = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [scan, setScan] = useState(false);
  const [ScanResult, setScanResult] = useState(false);
  const [result, setResult] = useState();

  useEffect(() => {
    // ShowCurrentDate();
  }, []);


  const onSuccess = (e) => {
    setResult(e.data)
    setScan(false)
    console.log('data', e)
  }

  const startScan = () => {
    setScan(true)
    setResult()
    setDesc()
  }
  const formatDate = (date, time) => {
    return `${time.getHours()}:${time.getMinutes()}`;
  };




  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, padding: 15 }}>
        <View style={styles.scrollViewStyle}>
        </View>
        {/* </ScrollView> */}
        {/* </SafeAreaView>
    <SafeAreaView> */}
        {/* <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.scrollView}> */}
        <View style={styles.body}>
          <View style={styles.sectionContainer}>
            <QRCodeScanner
              reactivate={true}
              // flashMode={RNCamera.Constants.FlashMode.torch}
              showMarker={true}
              ref={(node) => { this.scanner = node }}
              onRead={onSuccess}
              topContent={
                <Text style={styles.centerText}>
                  Scan your QRCode!
                </Text>

              }
              bottomContent={
                <View>
                  <TouchableOpacity style={styles.buttonTouchable} onPress={() => this.scanner.reactivate()}>
                    <Text style={styles.buttonTextStyle}>OK. Got it!</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.buttonTouchable} onPress={() => setScan(false)}>
                    <Text style={styles.buttonTextStyle}>Stop Scan</Text>
                  </TouchableOpacity>
                </View>
              }
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default QRCode;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F6F6F8',
  },
  dashedStyle: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    padding: 25,
  },
  dashedStyle1: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#E2E4E6',
    borderRadius: 50,
    justifyContent: 'center',
    width: '100%',
    height: 46,
  },
});
