import { IonInput, IonIcon } from '@ionic/react';
import { checkmark, pencil } from 'ionicons/icons';
import { useState, useCallback } from 'react';
import { styled } from 'styled-components';

type EditableTextProps = {
  text: string;
  onTextEdit: (newVal: string) => void;
};

export function EditableText({ text, onTextEdit }: EditableTextProps) {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [newVal, setNewVal] = useState('');

  const handleSave = useCallback(() => {
    setEditMode(false);
    if (text != newVal && newVal != '') onTextEdit && onTextEdit(newVal!);
  }, [newVal, onTextEdit, text]);

  return (
    <Container>
      {!editMode ? (
        text
      ) : (
        <IonInput
          value={text}
          fill="outline"
          onClick={(e) => e.stopPropagation()}
          onIonChange={(e) => {
            setNewVal(e.detail.value!);
          }}
          style={{ width: '90%' }}
        />
      )}
      <div style={{ marginTop: editMode ? '10px' : '1px', marginLeft: '10px' }}>
        <IonIcon
          icon={editMode ? checkmark : pencil}
          onClick={() => {
            editMode ? handleSave() : setEditMode(true);
          }}
          size={editMode ? 'large' : 'small'}
        />
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
`;
