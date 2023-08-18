import { IonButton, IonIcon, IonTitle } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import { ListHeader } from './styled';

interface AddFabProps {
  onClick: () => void;
  title: string;
}

export function AddListHeader({ onClick, title }: AddFabProps) {
  return (
    <ListHeader>
      <IonTitle>{title}</IonTitle>
      <IonButton
        fill="clear"
        size="large"
        shape="round"
        onClick={() => onClick && onClick()}
      >
        <IonIcon slot="icon-only" icon={addOutline}></IonIcon>
      </IonButton>
    </ListHeader>
  );
}
