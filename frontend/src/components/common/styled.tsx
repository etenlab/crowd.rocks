import { IonIcon, IonInput, IonTextarea } from '@ionic/react';
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

export const FullWidthContainer = styled.div`
  width: 50%;
`;

export const StChatIcon = styled(IonIcon)(() => ({
  width: '20px',
  height: '20px',
  marginLeft: '10px',
  marginTop: '5px',
  cursor: 'pointer',
  color: 'grey',
}));

export const StThumbDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const StIonVoteIcon = styled(IonIcon)(() => ({
  cursor: 'pointer',
  fontSize: '20px',
  padding: '5px',
}));

export const StVoteButtonsDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
`;

export const ListCaption = styled.div`
  text-transform: uppercase;
  font-weight: 700;
  opacity: 0.5;
`;

export const Icon = styled(IonIcon)`
  padding: 3px;
  margin: 2px;
  cursor: pointer;
  &:hover {
    box-shadow: 0px 0px 4px 1px gray;
    border-radius: 50%;
  }
`;
