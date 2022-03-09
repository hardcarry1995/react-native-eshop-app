import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import Pdf from 'react-native-pdf';

const ShowPDF = ({ navigation }) => {
  const requestData = navigation.getParam('pdfPath');

  useEffect(() => {
  }, []);

  return (
    <>
      <View style={styles.container}>
        <Pdf
          source={{ uri: requestData, cache: true }}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`current page: ${page}`);
          }}
          onError={(error) => {
            console.log(error);
          }}
          onPressLink={(uri) => {
            console.log(`Link presse: ${uri}`)
          }}
          style={styles.pdf} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 17,
  },
  footer: {
    flexDirection: 'row',
    height: 60,
    // backgroundColor: '#eeeeee',
    paddingHorizontal: 10,
    padding: 5,
  },
  btnSend: {
    backgroundColor: 'white',
    width: 40,
    height: 40,
    borderRadius: 360,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSend: {
    width: 30,
    height: 30,
    alignSelf: 'center',
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  inputs: {
    height: 40,
    marginLeft: 16,
    // borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  balloon: {
    maxWidth: 250,
    padding: 15,
    borderRadius: 20,
  },
  itemIn: {
    alignSelf: 'flex-start',
  },
  itemOut: {
    alignSelf: 'flex-end',
    backgroundColor: 'lightblue',
    elevation: 4,
    // padding:2,
    margin: 5,
    borderRadius: 15
  },
  itemOutNew: {
    flexDirection: 'row',
    backgroundColor: 'white',
    elevation: 5,
    padding: 12,
    margin: 5,
    borderRadius: 15
  },
  time: {
    alignSelf: 'flex-end',
    margin: 15,
    fontSize: 12,
    color: '#808080',
  },
  item: {
    marginVertical: 14,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F9E5E5',
    borderRadius: 20,
    padding: 5,
    marginRight: 150,
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
    //   padding: 95,
    height: '20%',
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
    height: 30,
    width: 120,
    marginTop: 40,
    borderWidth: 1,
    borderColor: '#9F1D20',
  },
  butt: {
    borderRadius: 10,
    // padding: 10,
    // elevation: 2
    height: 30,
    width: 120,
    marginTop: 40,
    marginLeft: 20,
  },
  buttonClose: {
    backgroundColor: '#9F1D20',
  },

  textStyle: {
    color: '#232323',
    // fontWeight: "bold",
    // textAlign: "center",
    fontSize: 15,
    alignSelf: 'center',
    marginTop: 4,
    marginLeft: 10,
  },
  textSty: {
    color: '#FFFFFF',
    // fontWeight: "bold",
    // textAlign: "center",
    fontSize: 15,
    alignSelf: 'center',
    marginTop: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  }
});

export default ShowPDF;