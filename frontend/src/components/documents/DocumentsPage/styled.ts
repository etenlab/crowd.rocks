import styled from 'styled-components';
import { IonIcon } from '@ionic/react';

export const ToolContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 30px;
  gap: 10px;
`;

export const PlusIcon = styled(IonIcon)(() => ({
  cursor: 'pointer',
  fontSize: '30px',
}));

export const FilterIcon = styled(IonIcon)(() => ({
  cursor: 'pointer',
  fontSize: '20px',
}));

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
