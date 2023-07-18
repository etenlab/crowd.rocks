import {
  IonBackButton,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { TMapList } from '../MapsPage';
import { MapItem } from '../MapItem/MapItem';

export type TMapListProps = {
  mapList: TMapList | undefined;
};

export const MapList = ({ mapList }: TMapListProps) => {
  if (!mapList?.length || mapList?.length < 1) {
    return <div> No maps found </div>;
  }

  return (
    <>
      <IonTitle>
        <IonButton>
          <IonIcon name="arrow-back-circle-outline"></IonIcon>
        </IonButton>
        Maps
      </IonTitle>
      <IonList>
        {mapList &&
          mapList.map((m) => <MapItem mapItem={m} key={m.id}></MapItem>)}
      </IonList>
    </>
  );
};
