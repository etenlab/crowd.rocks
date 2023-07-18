import { IonContent, IonPage } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router';
export type MapList = mapDto[];

const MapsPage: React.FC = () => {
  const history = useHistory();
  const [mapList, setMapList] = useState<MapList>();
  return (
    <IonPage>
      <IonContent>
        {Array(1000)
          .fill(0)
          .map((e, i) => (
            <div>{`asdf${i}`}</div>
          ))}
      </IonContent>
    </IonPage>
  );
};

export default MapsPage;
