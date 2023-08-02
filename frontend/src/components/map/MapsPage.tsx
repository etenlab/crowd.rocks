import { IonContent, IonPage } from '@ionic/react';
import { MapList } from './MapList/MapsList';
import { Route, RouteComponentProps } from 'react-router-dom';
import { MapDetails } from './MapDetails/MapDetails';
import { MapWordsTranslation } from './MapWordsTranslation/MapWordsTranslation';

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
              component={MapWordsTranslation}
            />
            <Route
              exact
              path={`${match.url}/details-original/:id`}
              component={MapDetails}
            />
            <Route
              exact
              path={`${match.url}/details-translated/:id`}
              component={MapDetails}
            />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};
