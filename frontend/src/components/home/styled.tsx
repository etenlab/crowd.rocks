import { styled } from 'styled-components';

import { IonCard, IonCardTitle, IonItemGroup, IonLabel } from '@ionic/react';

export const CustomIonCard = styled(IonCard)(() => ({
  width: '100%',
  padding: '20px',
}));

export const CustomGroup = styled(IonItemGroup)(() => ({
  marginTop: '20px',
}));

export const CustomIonLabel = styled(IonLabel)(() => ({
  marginLeft: '20px',
  fontSize: '16px',
  fontWeight: 'normal',
  opacity: '50%',
}));

export const StIonCardTitleContainer = styled(IonCardTitle)(() => ({
  marginTop: '0px',
}));
