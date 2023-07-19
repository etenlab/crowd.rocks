import { IonIcon } from '@ionic/react';
import { add, filter, logoAlipay, logoAmplify } from 'ionicons/icons';
import React from 'react';
import { styled } from 'styled-components';

type TMapToolsParams = {
  onFilterClick?: () => void;
  onTranslationsClick?: () => void;
  onAddClick?: () => void;
};

export const MapTools: React.FC<TMapToolsParams> = ({
  onFilterClick,
  onTranslationsClick,
  onAddClick,
}: TMapToolsParams) => {
  return (
    <StyledMapsToolsBox>
      {onFilterClick ? (
        <StIonIcon icon={filter} onClick={() => onFilterClick()} />
      ) : (
        <div></div>
      )}
      {onTranslationsClick ? (
        <div onClick={() => onTranslationsClick()}>
          <StIonIcon icon={logoAmplify} />
          <StIonIcon icon={logoAlipay} size="50px" />
        </div>
      ) : (
        <div></div>
      )}
      {onAddClick ? (
        <StIonIcon icon={add} onClick={() => onAddClick()} />
      ) : (
        <div></div>
      )}
    </StyledMapsToolsBox>
  );
};

const StyledMapsToolsBox = styled.div`
  font-size: 30px;
  justify-content: space-between;
  margin-top: 20px;
  padding-left: 10px;
  width: 100%;
  display: flex;
`;

const StIonIcon = styled(IonIcon)(() => ({
  cursor: 'pointer',
}));
