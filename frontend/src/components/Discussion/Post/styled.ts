import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
} from '@ionic/react';
import { styled } from 'styled-components';

export const CustomCard = styled(IonCard)(() => ({
  width: '100%',
  margin: 0,
}));

export const CustomCardTitle = styled(IonCardTitle)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

export const AuthorContainer = styled.div`
  color: var(--ion-color-medium);
  display: flex;
`;

export const TimestampContainer = styled.div`
  font-size: 12px;
  margin-left: 10px;
  margin-top: 10px;
`;

export const CustomCardContent = styled(IonCardContent)(() => ({}));

export const CustomCardHeader = styled(IonCardHeader)(() => ({}));

// TODO: would be nice to get this to float to the right of the container...
export const CustomChatIcon = styled(IonIcon)(() => ({
  cursor: 'pointer',
  fontSize: '20px',
  padding: '5px',
}));

export const Layout = styled.div`
  display: flex;
  justify-content: space-between;
  alignitems: center;
`;
