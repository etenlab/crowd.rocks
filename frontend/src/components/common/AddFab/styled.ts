import { IonButton } from '@ionic/react';
import { styled } from 'styled-components';

export const FabContainer = styled.div`
  height: 50px;
  display: flex;
  justify-content: space-between;
`;

export const CustomIonButton = styled(IonButton)(() => ({
  marginTop: '-20px',
}));
