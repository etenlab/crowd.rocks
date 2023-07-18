import { IonItem } from '@ionic/react';
import { TMap } from '../MapsPage';

export type TMapItemProps = {
  mapItem: TMap;
};

export const MapItem = ({ mapItem }: TMapItemProps) => {
  return (
    <IonItem routerLink={`/US/eng/1/maps/${mapItem.id}`}>
      {mapItem.name}
    </IonItem>
  );
};
