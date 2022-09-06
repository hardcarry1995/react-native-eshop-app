import { ApolloClient, InMemoryCache } from '@apollo/client';
import url from './api';

const defaultOptions = {
	watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
}

const client = new ApolloClient({
  uri: url,
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions,
  onError: ({ networkError, graphQLErrors }) => {
    console.log('graphQLErrors', graphQLErrors);
    console.log('networkError', networkError);
  },
});

export default client;
