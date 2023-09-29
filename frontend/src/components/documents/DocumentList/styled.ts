import { styled } from 'styled-components';
import { IonIcon, IonItem } from '@ionic/react';

// export const DocumentItemContainer = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   padding: 0px;
//   margin-top: 20px;
// `;

export const StItem = styled(IonItem)(() => ({
  display: 'flex',
  alignItems: 'center',
  '--padding-start': 0,
  '--inner-padding-end': 0,
}));

export const FileName = styled.div``;

export const IconRow = styled.div`
  display: flex;
  align-items: center;
`;

export const DownloadIcon = styled(IonIcon)`
  padding: 3px;
  margin: 2px;
  &:hover {
    box-shadow: 0px 0px 4px 1px gray;
    border-radius: 50%;
  }
`;
