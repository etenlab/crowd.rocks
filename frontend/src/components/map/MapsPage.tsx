import { IonContent, IonPage } from '@ionic/react';
import { MapList } from './MapList/MapsList';
import { Route, RouteComponentProps } from 'react-router-dom';
import { MapDetails } from './MapDetails/MapDetails';
import { MapTranslation } from './MapTranslation/MapTranslation';
import { WordTranslations } from './WordTranslations/WordTranslations';

export const MapsPage: React.FC<RouteComponentProps> = ({
  match,
}: RouteComponentProps) => {
  return (
    <IonPage>
      <IonContent>
        <div className="page">
          <div className="section">
            <Route exact path={`${match.url}`} render={() => <MapList />} />
            <Route
              exact
              path={`${match.url}/translation`}
              component={MapTranslation}
            />
            <Route
              exact
              path={`${match.url}/details/:id`}
              component={MapDetails}
            />
            <Route
              exact
              path={`${match.url}/word-translations/:id/:fullLangTag`}
              component={WordTranslations}
            />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};
