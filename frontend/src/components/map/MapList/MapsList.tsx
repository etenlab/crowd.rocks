import { IonList } from '@ionic/react';
import { TMapList } from '../MapsPage';
import { MapItem } from '../MapItem/MapItem';
import { Caption } from '../../common/Caption/Caption';

export type TMapListProps = {
  mapList: TMapList | undefined;
};

export const MapList = ({ mapList }: TMapListProps) => {
  if (!mapList?.length || mapList?.length < 1) {
    return <div> No maps found </div>;
  }

  return (
    <>
      <Caption>Maps</Caption>
      <IonList>
        {mapList &&
          mapList.map((m) => <MapItem mapItem={m} key={m.id}></MapItem>)}
      </IonList>
    </>
  );
};
