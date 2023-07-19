import { IonItem } from '@ionic/react';
import { styled } from 'styled-components';

export type TMapItemProps = React.HTMLAttributes<HTMLIonItemElement> & {
  mapItem: TMap;
};

const NotStyledMapItem = ({ mapItem, ...rest }: TMapItemProps) => {
  return (
    <IonItem {...rest} routerLink={`/US/eng/1/maps/details/${mapItem.id}`}>
      {mapItem.name}
    </IonItem>
  );
};

export const MapItem = styled(NotStyledMapItem)(() => ({
  border: 'solid 1px #cfcfcf',
  marginTop: '20px',
}));
