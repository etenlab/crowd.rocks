import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import {
  split,
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';
import { createClient } from 'graphql-ws';

import { typePolicies } from './cacheTypePolicies';

const server_url = `${import.meta.env.VITE_APP_SERVER_URL}/graphql`;
const ws_server_url = `${import.meta.env.VITE_APP_WS_SERVER_URL}/graphql`;

const httpLink = createUploadLink({
  uri: server_url,
  headers: {
    'Apollo-Require-Preflight': 'true',
  },
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: ws_server_url,
  }),
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

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
  link: authLink.concat(splitLink),
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
