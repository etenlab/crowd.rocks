import React from 'react';
import { add, funnelOutline } from 'ionicons/icons';

import { useTr } from '../../../hooks/useTr';

import { StyledDocumentsToolsBox, StIonIcon, StIonButton } from './styled';

type DocumentsToolsParams = {
  onFilterClick?: () => void;
  onTranslationsClick?: () => void;
  onResetClick?: () => void;
  onAddClick?: () => void;
};

export function DocumentsTools({
  onFilterClick,
  onTranslationsClick,
  onResetClick,
  onAddClick,
}: DocumentsToolsParams) {
  const { tr } = useTr();

  return (
    <StyledDocumentsToolsBox>
      {onFilterClick ? (
        <StIonIcon icon={funnelOutline} onClick={() => onFilterClick()} />
      ) : null}
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
        <StIonIcon
          icon={add}
          onClick={() => {
            onAddClick();
          }}
        />
      ) : null}
    </StyledDocumentsToolsBox>
  );
}
