import { IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { add } from 'ionicons/icons';
import { FabContainer } from './styled';

interface AddFabProps {
  onClick: () => void;
}

export function AddFab({ onClick }: AddFabProps) {
  return (
    <FabContainer className="section">
      <IonFab>
        <IonFabButton onClick={() => onClick && onClick()}>
          <IonIcon icon={add} />
        </IonFabButton>
      </IonFab>
    </FabContainer>
  );
}
