import { ApolloClient, InMemoryCache } from '@apollo/client';
import url from './api';
const client = new ApolloClient({
  uri: url,
  cache: new InMemoryCache(),
  onError: ({ networkError, graphQLErrors }) => {
    console.log('graphQLErrors', graphQLErrors);
    console.log('networkError', networkError);
  },
});

export default client;
