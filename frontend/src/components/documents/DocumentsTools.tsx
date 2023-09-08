import { IonButton, IonIcon } from '@ionic/react';
import { funnelOutline } from 'ionicons/icons';
import React from 'react';
import { styled } from 'styled-components';
import { useTr } from '../../hooks/useTr';
import { FileUploadBtn } from '../common/FileUploadBtn/FileUploadBtn';

type TDocumentsToolsParams = {
  onFilterClick?: () => void;
  onTranslationsClick?: () => void;
  onResetClick?: () => void;
  onAddClick?: (file: File) => void;
};

export const DocumentsTools: React.FC<TDocumentsToolsParams> = ({
  onFilterClick,
  onTranslationsClick,
  onResetClick,
  onAddClick,
}: TDocumentsToolsParams) => {
  const { tr } = useTr();
  return (
    <StyledDocumentsToolsBox>
      {onFilterClick ? (
        <StIonIcon icon={funnelOutline} onClick={() => onFilterClick()} />
      ) : (
        <div> </div>
      )}
      {onTranslationsClick ? (
        <StIonButton onClick={() => onTranslationsClick()}>
          {tr('Translate')}
        </StIonButton>
      ) : null}
      {onResetClick ? (
        <StIonButton onClick={() => onResetClick()}>
          {tr('Reset Data')}
        </StIonButton>
      ) : null}
      {onAddClick ? (
        <FileUploadBtn accept=".*" onSelect={onAddClick} />
      ) : (
        <div> </div>
      )}
    </StyledDocumentsToolsBox>
  );
};

const StyledDocumentsToolsBox = styled.div`
  font-size: 30px;
  justify-content: space-between;
  margin-top: 20px;
  width: 100%;
  display: flex;
`;

const StIonButton = styled(IonButton)(() => ({
  width: '200px',
}));

const StIonIcon = styled(IonIcon)(() => ({
  cursor: 'pointer',
}));
