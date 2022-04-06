import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { Formik } from "formik";
import * as Yup from "yup";
import AsyncStorage from '@react-native-community/async-storage';
import moment from "moment";
import { CREATE_CONTACT_REQUEST } from "../constants/queries";
import client from '../constants/client';
import Toast from 'react-native-toast-message';

const validationSchemea = Yup.object().shape({
  fullname: Yup.string().required("* Required"),
  email: Yup.string().required("* Required").email("Invalid Email address"),
  phone: Yup.string().required("* Required"),
  subject: Yup.string().required("* Required"),
  message: Yup.string().required("* Required")
});


const ContactForm = () => {

  const [loading, setLoading] = useState(false);

  const onSubmit = async (values) => {
    setLoading(true);
    const token = await AsyncStorage.getItem('userToken');
    client
      .mutate({
        mutation : CREATE_CONTACT_REQUEST,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        variables: {
          ...values,
          date: moment().format()
        },
      }).then(async result => {
        console.log(result);
        Toast.show({
          type: "success",
          text1: "Success!",
          text2: "Your request has been submitted successfully!"
        });
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        Toast.show({
          type: "error",
          text1: "Oop!",
          text2: "Something went wrong! Please try again later!"
        })
        setLoading(false);
      });
  }

  return (
  <Formik
    initialValues={{
      fullname: "",
      email : "",
      phone : "",
      subject: "",
      message: ""
    }}
    onSubmit={values => onSubmit(values)}
    validationSchema={validationSchemea}
  >
    {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
      <View style={styles.container}>
        <Text style={styles.title}>Contact Us</Text>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput 
            style={styles.input}  
            placeholder="Full Name"
            keyboardType='default'
            returnKeyType='next'
            onChangeText={handleChange('fullname')}
            onBlur={handleBlur('fullname')}
            value={values.fullname}
          />
					{errors.fullname && <Text style={styles.error}>{errors.fullname}</Text>}
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput 
            style={styles.input}  
            placeholder="Email"
            keyboardType='email-address'
            returnKeyType='next'
            onChangeText={handleChange("email")}
            onBlur={handleBlur('email')}
            value={values.email}
          />
					{errors.email && <Text style={styles.error}>{errors.email}</Text>}
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput 
            style={styles.input}  
            placeholder="Phone Number"
            keyboardType='phone-pad'
            returnKeyType='next'
            onChangeText={handleChange('phone')}
            onBlur={handleBlur('phone')}
            value={values.phone}
          />
					{errors.phone && <Text style={styles.error}>{errors.phone}</Text>}
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Subject</Text>
          <TextInput 
            style={styles.input}  
            placeholder="Subject"
            keyboardType='default'
            returnKeyType='next'
            onChangeText={handleChange('subject')}
            onBlur={handleBlur('subject')}
            value={values.subject}
          />
					{errors.subject && <Text style={styles.error}>{errors.subject}</Text>}
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Message</Text>
          <TextInput 
            style={{...styles.input, height : 100}}  
            placeholder="Message"
            keyboardType='default'
            returnKeyType='done'
            multiline
            onChangeText={handleChange('message')}
            onBlur={handleBlur('message')}
            value={values.message}
          />
					{errors.message && <Text style={styles.error}>{errors.message}</Text>}
        </View>
        <View style={{...styles.formContainer, alignItems: 'center'}}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            { loading && <ActivityIndicator  />}
            {!loading && <Text style={styles.submitButtonText}>Submit</Text> }
          </TouchableOpacity>
        </View>
      </View>
    )}
  </Formik>
   
  )
}

export default ContactForm

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20, 
    paddingVertical: 20
  },
  formContainer: {
    paddingVertical: 10
  },
  title: {
    fontWeight: '700', 
    fontSize: 24
  },
  label: {
    fontSize: 16,
    marginLeft: 5
  },  
  input: {
    height: 45,
    borderWidth: 1,
    borderColor : "#888",
    borderRadius : 10,
    paddingHorizontal: 10,
    marginTop: 10
  },
  submitButton : {
    height: 50,
    backgroundColor : "green",
    width: 140,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  submitButtonText:{
    fontSize : 18, 
    color: "#fff",
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing : 1
  },
  error : {
    color: "red",
    fontSize : 12, 
    position: "absolute",
    right: 10,
    top : 20
  },
})