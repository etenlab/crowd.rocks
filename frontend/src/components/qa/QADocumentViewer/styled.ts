import { IonSelect, IonTextarea, IonInput } from '@ionic/react';
import styled from 'styled-components';

export const QATextInput = styled(IonTextarea)({
  border: '1px solid #ccc',
  borderRadius: '10px',
  padding: '0 10px',
});

export const QuestionSelect = styled(IonSelect)({
  border: '1px solid #ccc',
  borderRadius: '10px',
  padding: '0 10px',
});

export const QuestionItemInput = styled(IonInput)({
  border: '1px solid #ccc',
  borderRadius: '10px',
  '--padding-start': '10px',
  '--padding-end': '10px',
});

export const QuestionItemInputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
