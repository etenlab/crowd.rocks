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
