import { IonIcon, IonTitle } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import { CustomIonButton, FabContainer } from './styled';

interface AddFabProps {
  onClick: () => void;
  title: string;
}

export function AddFab({ onClick, title }: AddFabProps) {
  return (
    <FabContainer className="section">
      <IonTitle>{title}</IonTitle>
      <CustomIonButton
        fill="clear"
        size="large"
        shape="round"
        onClick={() => onClick && onClick()}
      >
        <IonIcon slot="icon-only" icon={addOutline}></IonIcon>
      </CustomIonButton>
    </FabContainer>
  );
}
