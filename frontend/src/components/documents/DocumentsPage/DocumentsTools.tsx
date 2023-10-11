import React from 'react';
import { add, funnelOutline } from 'ionicons/icons';

import { ToolContainer, FilterIcon, PlusIcon } from './styled';

type DocumentsToolsParams = {
  onFilterClick?: () => void;
  onTranslationsClick?: () => void;
  onResetClick?: () => void;
  onAddClick?: () => void;
};

export function DocumentsTools({
  onFilterClick,
  onAddClick,
}: DocumentsToolsParams) {
  return (
    <ToolContainer>
      {onFilterClick ? (
        <FilterIcon
          icon={funnelOutline}
          onClick={() => onFilterClick()}
          color="primary"
        />
      ) : null}
      {onAddClick ? (
        <PlusIcon
          icon={add}
          onClick={() => {
            onAddClick();
          }}
          color="primary"
        />
      ) : null}
    </ToolContainer>
  );
}
