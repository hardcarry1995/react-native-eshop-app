import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator, } from 'react-native';
import { bearerToken } from '../../constants/utils';
import { gql } from '@apollo/client';
import client from '../../constants/client';

const FORGET_PASSWORD = gql`
  query ForgetPassword($email: String!) {
    forgetPassword(email: $email, domainUrl: 1) {
      count
      currentPage
      message
      nextPage
      prevPage
      success
      totalPages
    }
  }
`;

class ForgotPassword extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      loading: false,
    };
  }

  async handleSubmit() {
    if (this.state.email === '') {
      return;
    }
    this.setState({ loading: true });
    client
      .query({
        query: FORGET_PASSWORD,
        fetchPolicy: 'no-cache',
        context: {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            'Content-Length': 0,
          },
        },
        variables: {
          email: this.state.email,
        },
      })
      .then(async result => {
        this.setState({ loading: false });
        if (result.data.forgetPassword.success) {
          Alert.alert(
            '',
            result.data.forgetPassword.message,
            [
              {
                text: 'OK',
                onPress: () => this.props.navigation.goBack(),
              },
            ],
            { cancelable: false },
          );
        } else {
          Alert.alert('', result.data.forgetPassword.message);
        }
      })
      .catch(err => {
        this.setState({ loading: false });
        console.log(err);
      });
  }

  render() {
    return (
      <View style={{ backgroundColor: '#DB3236', flex: 1 }}>
        <View style={styles.main}>
          <TextInput
            style={{
              borderWidth: 2,
              width: 255,
              height: 41,
              borderColor: '#F54D30',
              left: 28,
              borderRadius: 10,
              paddingLeft: 10,
              marginTop: 30,
              marginBottom: 30,
            }}
            onChangeText={text => {
              this.setState({ email: text });
            }}
            placeholder="Enter Your Email"
          />
          <TouchableOpacity
            style={{
              backgroundColor: '#9F1D20',
              padding: 10,
              borderRadius: 10,
              height: 39,
              width: 140,
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              this.handleSubmit();
            }}>
            {this.state.loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: '#FFFFFF', alignSelf: 'center' }}>
                Confirm
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    height: 200,
    width: '88%',
    backgroundColor: 'white',
    borderRadius: 35,
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 8,
    paddingLeft: 2,
    paddingRight: 2,
    marginTop: 50,
    marginLeft: 16,
    marginRight: 16,
  },
});

export default ForgotPassword;
