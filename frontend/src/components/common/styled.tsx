import { IonInput, IonTextarea } from '@ionic/react';
import { styled } from 'styled-components';

export const Input = styled(IonInput)(() => ({
  '--padding-start': '16px',
  '--padding-end': '16px',
  '--border-radius': '16px',
}));

export const Textarea = styled(IonTextarea)(() => ({
  '--background': '#eee',
  '--padding-start': '16px',
  '--padding-end': '16px',
  '--border-radius': '16px',
}));

export const CaptainContainer = styled.div`
  height: 50px;
  margin-left: -16px;
`;

export const FilterContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

export const CardListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
  height: 500px;
  overflow-y: auto;
`;

export const CardContainer = styled.div`
  width: 100%;
`;

export const LanguageSelectorContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
`;

export const FabContainer = styled.div`
  text-align: right;
`;
