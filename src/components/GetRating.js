import React, { Component } from 'react';
import { View, Text, ToastAndroid } from 'react-native';
import { GET_RATING } from '../constants/queries'
import client from '../constants/client';
import AsyncStorage from '@react-native-community/async-storage';

export class GetRating extends Component {

    async componentDidMount() {
        await this.fetchToken();
    }

    fetchToken = async () => {
        let token = await AsyncStorage.getItem('userToken');
        this.fetchProducts(token);
    }

    fetchProducts = async (token) => {
        client
            .query({
                query: GET_RATING,
                fetchPolicy: 'no-cache',
                context: {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Length': 0,
                    },
                    variables: {
                        id: this.props.companyId,
                    },
                },
            })
            .then(async result => {
                // console.log("rating", result.data.getMstRatingScoreList);
                if (result.data.getMstRatingScoreList.success) {
                    this.props.onprogress(result.data.getMstRatingScoreList.count)
                    //   onprogress={(k)=>{k}}
                } else {
                    ToastAndroid.show(
                        result.data.getBusinessList.message,
                        ToastAndroid.SHORT,
                    );
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    render() {
        return (
            <View>
            </View>
        )
    }
}

export default GetRating
