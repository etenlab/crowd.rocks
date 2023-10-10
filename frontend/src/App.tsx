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

import Body from './Body';

console.info('Runninig in environment: ' + import.meta.env.MODE);

setupIonicReact({
  innerHTMLTemplatesEnabled: true,
});

const App: React.FC = () => (
  <IonApp>
    <AppContextProvider>
      <ThemeProvider>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route path="/">
              <Body />
            </Route>
          </IonRouterOutlet>
        </IonReactRouter>
      </ThemeProvider>
    </AppContextProvider>
  </IonApp>
);

export default App;
