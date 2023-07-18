import { IonContent, IonPage } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { mockMapList } from './mocks/mapData.mock';
import { MapList } from './MapList/MapsList';

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

const MapsPage: React.FC = () => {
  const history = useHistory();
  const [mapList, setMapList] = useState<TMapList>();

  useEffect(() => {
    // mocked data gathering
    setMapList(mockMapList);
  }, []);

  return (
    <IonPage>
      <IonContent>
        <MapList mapList={mapList} />
      </IonContent>
    </IonPage>
  );
};

export default MapsPage;
