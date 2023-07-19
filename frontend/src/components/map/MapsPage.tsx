import { IonContent, IonPage } from '@ionic/react';
import { useCallback, useEffect, useState } from 'react';
import { mockMapWithContentList } from './mocks/mapData.mock';
import { MapList } from './MapList/MapsList';
import { Route, RouteComponentProps } from 'react-router-dom';
import { MapDetails } from './MapDetails/MapDetails';
import { MapTranslation } from './MapTranslation/MapTranslation';

const MapsPage: React.FC<RouteComponentProps> = ({
  match,
}: RouteComponentProps) => {
  const [mapList, setMapList] = useState<TMapList>();
  const [selectedMapId, setSelectedMapId] = useState<number>();

  useEffect(() => {
    // mocked data gathering
    setMapList(mockMapWithContentList);
  }, []);

  const handleSelectMapId = useCallback((id: number) => {
    setSelectedMapId(id);
  }, []);

  return (
    <IonPage>
      <IonContent>
        <div className="page">
          <div className="section">
            <Route
              exact
              path={`${match.url}`}
              render={() => (
                <MapList mapList={mapList} onSelectMapId={handleSelectMapId} />
              )}
            />
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
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MapsPage;
