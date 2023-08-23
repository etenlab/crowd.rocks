import { styled } from 'styled-components';
import { IonRadioGroup } from '@ionic/react';

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

export const CustomIonRadioGroup = styled(IonRadioGroup)(() => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '16px',
  height: '500px',
  overflowY: 'auto',
}));
