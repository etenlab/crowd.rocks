import styled from 'styled-components';
import { IonButton, IonIcon } from '@ionic/react';

export const StyledDocumentsToolsBox = styled.div`
  font-size: 30px;
  justify-content: space-between;
  margin-top: 20px;
  width: 100%;
  display: flex;
`;

export const StIonButton = styled(IonButton)(() => ({
  width: '200px',
}));

export const StIonIcon = styled(IonIcon)(() => ({
  cursor: 'pointer',
}));

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
