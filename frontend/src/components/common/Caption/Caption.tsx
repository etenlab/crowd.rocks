import { IonIcon, IonText, IonTitle, useIonRouter } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { ReactElement } from 'react';
import { styled } from 'styled-components';

export type TCaptionProps = {
  handleBackClick?: () => void;
  children: ReactElement | string | string[];
};

export const Caption = ({ handleBackClick, children }: TCaptionProps) => {
  const router = useIonRouter();
  let onClickAction: () => void;
  if (handleBackClick) {
    onClickAction = handleBackClick;
  } else {
    onClickAction = router.goBack;
  }
  return (
    <StyledIonTitile>
      <StIonIcon
        color="black"
        icon={arrowBack}
        onClick={() => onClickAction()}
      ></StIonIcon>
      <StIonText>{children}</StIonText>
    </StyledIonTitile>
  );
};

const StyledIonTitile = styled(IonTitle)(() => ({
  marginTop: '10px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
}));

const StIonText = styled(IonText)(() => ({
  marginLeft: '10px',
}));

const StIonIcon = styled(IonIcon)(() => ({
  cursor: 'pointer',
}));
