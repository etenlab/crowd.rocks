import { IonButton } from '@ionic/react';

import { Container } from './styled';

import { useTr } from '../../../hooks/useTr';

type ConfirmButtonsProps = {
  cancelLabel?: string;
  saveLabel?: string;
  onCancel(): void;
  onSave(): void;
};

export function ConfirmButtons({
  cancelLabel,
  saveLabel,
  onCancel,
  onSave,
}: ConfirmButtonsProps) {
  const { tr } = useTr();

  return (
    <Container>
      <IonButton fill="outline" onClick={onCancel}>
        {cancelLabel ? cancelLabel : tr('Cancel')}
      </IonButton>
      <IonButton onClick={onSave}>
        {saveLabel ? saveLabel : tr('Save')}
      </IonButton>
    </Container>
  );
}
