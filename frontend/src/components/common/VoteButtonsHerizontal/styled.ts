import { IonIcon } from '@ionic/react';
import { styled } from 'styled-components';

export const StButtonsDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
`;

export const StIonIcon = styled(IonIcon)(() => ({
  cursor: 'pointer',
  fontSize: '20px',
  padding: '5px',
}));

export const StThumbDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #888;
  border-radius: 4px;
  padding: 5px;
  gap: 5px;
`;
