import { IonButton, IonIcon } from '@ionic/react';
import { funnelOutline } from 'ionicons/icons';
import React from 'react';
import { styled } from 'styled-components';
import { FileUploadBtn } from '../../common/FileUploadBtn/FileUploadBtn';
import { useTr } from '../../../hooks/useTr';

type TMapToolsParams = {
  onFilterClick?: () => void;
  onTranslationsClick?: () => void;
  onResetClick?: () => void;
  onAddClick?: (file: File) => void;
};

export const MapTools: React.FC<TMapToolsParams> = ({
  onFilterClick,
  onTranslationsClick,
  onResetClick,
  onAddClick,
}: TMapToolsParams) => {
  const { tr } = useTr();
  return (
    <StyledMapsToolsBox>
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
          {tr('Reset Map Data')}
        </StIonButton>
      ) : null}
      {onAddClick ? (
        <FileUploadBtn accept=".svg" onSelect={onAddClick} />
      ) : (
        <div> </div>
      )}
    </StyledMapsToolsBox>
  );
};

const StyledMapsToolsBox = styled.div`
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
