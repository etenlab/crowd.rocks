import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  // createHttpLink,
} from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';

import { typePolicies } from './cacheTypePolicies';

let server_url = 'http://localhost:3000/graphql';

if (process.env.NODE_ENV == 'production') {
  server_url = 'https://dev.crowd.rocks/graphql';
}

// const httpLink = createHttpLink({
//   uri: server_url,
// });
const httpLink = createUploadLink({
  uri: server_url,
  headers: {
    'Apollo-Require-Preflight': 'true',
  },
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const apollo_client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies,
  }),
});

// const client = new ApolloClient({
//   uri: 'http://localhost:3001/graphql',
//   cache: new InMemoryCache(),
// });

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <ApolloProvider client={apollo_client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
);
