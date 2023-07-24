import { IonContent, IonPage } from '@ionic/react';
import { useCallback, useEffect, useState } from 'react';
// import { mockMapWithContentList } from './mocks/mapData.mock';
import { MapList } from './MapList/MapsList';
import { Route, RouteComponentProps } from 'react-router-dom';
import { MapDetails } from './MapDetails/MapDetails';
import { MapTranslation } from './MapTranslation/MapTranslation';
import { WordTranslations } from './WordTranslations/WordTranslations';
import { useMapTranslationTools } from './hooks/useMapTranslationTools';

export const MapsPage: React.FC<RouteComponentProps> = ({
  match,
}: RouteComponentProps) => {
  const [mapList, setMapList] = useState<TMapsList>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedMapId, setSelectedMapId] = useState<number>();
  const { getOriginalMaps } = useMapTranslationTools();

  useEffect(() => {
    // mocked data gathering
    // setMapList(mockMapWithContentList);
    async function getMaps() {
      const mapsList = await getOriginalMaps();
      setMapList(mapsList);
    }
    getMaps();
  }, [getOriginalMaps]);

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
