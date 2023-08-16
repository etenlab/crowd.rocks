import { IonButton, IonIcon } from '@ionic/react';
import { funnelOutline } from 'ionicons/icons';
import React from 'react';
import { styled } from 'styled-components';
import { FileUploadBtn } from '../../common/FileUploadBtn/FileUploadBtn';

type TMapToolsParams = {
  onFilterClick?: () => void;
  onTranslationsClick?: () => void;
  onAddClick?: (file: File) => void;
};

export const MapTools: React.FC<TMapToolsParams> = ({
  onFilterClick,
  onTranslationsClick,
  onAddClick,
}: TMapToolsParams) => {
  return (
    <StyledMapsToolsBox>
      {onFilterClick ? (
        <StIonIcon icon={funnelOutline} onClick={() => onFilterClick()} />
      ) : null}
      {onTranslationsClick ? (
        <StIonButton onClick={() => onTranslationsClick()}>
          Translate
        </StIonButton>
      ) : null}
      {onAddClick ? (
        <FileUploadBtn accept=".svg" onSelect={onAddClick} />
      ) : null}
    </StyledMapsToolsBox>
  );
};

const StyledMapsToolsBox = styled.div`
  font-size: 30px;
  justify-content: space-between;
  margin-top: 20px;
  padding-left: 37%;
  width: 100%;
  display: flex;
`;

const StIonButton = styled(IonButton)(() => ({
  width: '200px',
}));

const StIonIcon = styled(IonIcon)(() => ({
  cursor: 'pointer',
}));
