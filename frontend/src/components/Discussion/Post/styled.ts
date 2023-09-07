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
  font-size: 12px;
  display: flex;
`;

export const TimestampContainer = styled.div`
  margin-left: 10px;
`;

export const CustomCardContent = styled(IonCardContent)(() => ({
  color: 'var(--ion-text-color)',
}));

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
  align-items: center;
`;
