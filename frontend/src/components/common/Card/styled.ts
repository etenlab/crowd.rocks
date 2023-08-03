import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from '@ionic/react';
import { styled } from 'styled-components';

export const CustomCard = styled(IonCard)(() => ({
  width: '100%',
  margin: 0,
}));

export const CustomCardTitle = styled(IonCardTitle)(() => ({
  fontSize: '17px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

export const CustomCardContent = styled(IonCardContent)(() => ({}));

export const CustomCardHeader = styled(IonCardHeader)(() => ({}));

export const Layout = styled.div`
  display: flex;
  justify-content: space-between;
  alignitems: center;
`;
