const devApi = 'https://mobileapiv2.ezyfind.co.za';
const prodApi = 'https://api.ezyfind.co.za';
const apiUrlEndPoint = (__DEV__) ? devApi : prodApi;

const url = apiUrlEndPoint + '/graphql';

export default url;
