import { IonBadge, IonButton, IonIcon } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import { ListHeader } from './styled';
import './styled.css';

interface AddFabProps {
  onClick: () => void;
  title: string;
  baseIcon?: string;
}

export function AddListHeader({ onClick, title, baseIcon }: AddFabProps) {
  return (
    <ListHeader>
      <h3>{title}</h3>
      <IonButton
        fill="clear"
        size="large"
        shape="round"
        onClick={() => onClick && onClick()}
      >
        {baseIcon ? (
          <>
            <IonIcon icon={baseIcon}></IonIcon>
            <IonBadge className="add-badge">+</IonBadge>
          </>
        ) : (
          <IonIcon slot="icon-only" icon={addOutline} />
        )}
      </IonButton>
    </ListHeader>
  );
}
