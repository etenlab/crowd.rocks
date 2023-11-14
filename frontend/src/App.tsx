import { Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import '@fontsource/poppins/100.css';
import '@fontsource/poppins/200.css';
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';
import '@fontsource/poppins/900.css';

/* Theme variables */
import './theme/variables.css';

import { AppContextProvider } from './AppContext';
import { ThemeProvider } from './theme';

import { Body } from './Body';

import {
  split,
  InMemoryCache,
  ApolloClient,
  ApolloProvider,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createUploadLink } from 'apollo-upload-client';
import { typePolicies } from './cacheTypePolicies';
import { createClient } from 'graphql-ws';

console.info('Runninig in environment: ' + import.meta.env.MODE);

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

// const client = new ApolloClient({
//   uri: 'http://localhost:3001/graphql',
//   cache: new InMemoryCache(),
// });

setupIonicReact({
  innerHTMLTemplatesEnabled: true,
});
const cache = new InMemoryCache({
  typePolicies,
});

export const apollo_client = new ApolloClient({
  cache,
  link: authLink.concat(splitLink),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).cacheApollo = apollo_client;

const App: React.FC = () => {
  return (
    <IonApp>
      <ApolloProvider client={apollo_client}>
        <AppContextProvider>
          <ThemeProvider autoDetectPrefersDarkMode={false}>
            <IonReactRouter>
              <IonRouterOutlet>
                <Route path="/">
                  <Body />
                </Route>
              </IonRouterOutlet>
            </IonReactRouter>
          </ThemeProvider>
        </AppContextProvider>
      </ApolloProvider>
    </IonApp>
  );
};

export default App;
