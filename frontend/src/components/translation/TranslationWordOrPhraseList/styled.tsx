import { styled } from 'styled-components';
import { IonIcon } from '@ionic/react';

export const CardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  width: calc(100% - 30px);
  margin-left: 20px;
`;

export const NoDefinition = styled.div`
  margin-left: 20px;
  font-size: 14px;
  color: rgb(153, 153, 153);
`;

export const CardListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  height: 500px;
  overflow-y: auto;
  gap: 16px;
`;

export const StButtonsDiv = styled.div`
  display: flex;
  flex-direction: column;
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
`;
