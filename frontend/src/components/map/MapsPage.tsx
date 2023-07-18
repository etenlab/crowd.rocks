import { IonContent, IonPage, IonRouterOutlet } from '@ionic/react';
import { useEffect, useState } from 'react';
import { mockMapList } from './mocks/mapData.mock';
import { MapList } from './MapList/MapsList';
import { Route, RouteComponentProps } from 'react-router-dom';
import { MapDetails } from './MapDetails/MapDetails';

export type TMap = {
  id: number;
  name: string;
  languageCode: string;
  dialectCode?: string;
  geoCode?: string;
  createdAt: Date;
  createdByUserId?: number;
  content: string;
};

export type TMapList = TMap[];

const MapsPage: React.FC<RouteComponentProps> = ({
  match,
}: RouteComponentProps) => {
  const [mapList, setMapList] = useState<TMapList>();

  useEffect(() => {
    // mocked data gathering
    setMapList(mockMapList);
  }, []);

  return (
    <IonPage>
      <IonContent>
        <IonRouterOutlet>
          <Route
            exact
            path={`${match.url}`}
            render={() => <MapList mapList={mapList} />}
          />
          <Route
            path={`${match.url}/:id`}
            render={() => <MapDetails></MapDetails>}
          />
        </IonRouterOutlet>
      </IonContent>
    </IonPage>
  );
};

export default MapsPage;
