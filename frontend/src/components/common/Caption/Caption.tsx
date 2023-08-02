import { IonIcon, IonText, useIonRouter } from '@ionic/react';
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
    <CaptainContainer>
      <StIonIcon
        color="black"
        icon={arrowBack}
        onClick={() => onClickAction()}
      />
      <StIonText>{children}</StIonText>
    </CaptainContainer>
  );
};

const CaptainContainer = styled.div`
  display: flex;
  padding: 16px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const StIonText = styled(IonText)(() => ({
  marginLeft: '10px',
  fontWeight: '700',
}));

const StIonIcon = styled(IonIcon)(() => ({
  cursor: 'pointer',
}));
