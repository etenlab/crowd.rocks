import { IonItem } from '@ionic/react';
import { TMap } from '../MapsPage';

export type TMapItemProps = {
  mapItem: TMap;
};

export const MapItem = ({ mapItem }: TMapItemProps) => {
  return <IonItem>{mapItem.name}</IonItem>;
};
