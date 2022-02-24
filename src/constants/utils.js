import Toast from 'react-native-root-toast';
import Constant from '../constants/constant';
import AsyncStorage from '@react-native-community/async-storage';
import {
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk-next';

const _emailValidate = text => {
  console.log(text);
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (reg.test(text) === false) {
    console.log('Email is Not Correct');
    return false;
  } else {
    console.log('Email is Correct');
    return true;
  }
};

const heightValidation = heightft => {
  if (heightft >= 2 && heightft <= 9) {
    return true;
  } else {
    return false;
  }
};
// Add a Toast on screen.
const toastShow = msg => {
  Toast.show(msg, {
    duration: Toast.durations.SHORT,
    position: Toast.positions.BOTTOM,
    shadow: false,
    animation: true,
    hideOnPress: true,
    delay: 0,
    onShow: () => {
      // calls on toast\`s appear animation start
    },
    onShown: () => {
      // calls on toast\`s appear animation end.
    },
    onHide: () => {
      // calls on toast\`s hide animation start.
    },
    onHidden: () => {
      // calls on toast\`s hide animation end.
    },
  });
};

const handleClick = () => {
  const min = 1;
  const max = 100;
  const rand = min + Math.random() * (max - min);
  return rand;
};

const is_url = str => {
  const regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  if (regexp.test(str)) {
    return true;
  } else {
    return false;
  }
};

const _signOutAsync = async navigation => {
  LoginManager.logOut();
  await AsyncStorage.clear();
  navigation.navigate('AuthLoading');
  // ApiService.api.get(ApiService.logout)
  //   .then((response) => {

  //   })
  //   .catch(function (error) {
  //     //Utils.toastShow(Constant.message)

  //     console.log("error " + error);
  //   })
};

const imagePrefix = 'https://www.ezyfind.co.za/Documents/';

const bearerToken =
  // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIiLCJqdGkiOiI0NWQwYTQyYy0yMjM2LTQ5NTEtODdkMS00OTNiMzRkZjVkMjIiLCJJZCI6IjAiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJHdWVzdCIsImV4cCI6MTYyNDgwNTkxMCwiaXNzIjoid3d3LkV6eUZpbmQuY28uemEiLCJhdWQiOiJ3d3cuRXp5RmluZC5jby56YSJ9.1RRTPV0z1wBB6PW2-9yGAnpCbZea_njsMGMKaCjS14c';
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIiLCJqdGkiOiIyYWQ5YTcwYS1kOWQwLTRlNTAtYTI3NS1jODczODUyZmM5NDYiLCJJZCI6IjIwMzQ3IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiSW5kaXZpZHVhbChTZWVrZXIpIiwiZXhwIjoxNjI5NjI0NzI3LCJpc3MiOiJ3d3cuRXp5RmluZC5jby56YSIsImF1ZCI6Ind3dy5FenlGaW5kLmNvLnphIn0.0E_STlJH9JAXbEEpyC96zzhKflgVscYIZKoll-MQFZs';


export {
  // _emailValidate,
  // toastShow,
  // handleClick,
  // is_url,
  _signOutAsync,
  // heightValidation,
  bearerToken,
  imagePrefix,
};
