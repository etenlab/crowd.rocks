import { useState, useRef } from 'react';
import {
  IonButton,
  IonItem,
  IonLabel,
  IonList,
  IonSelectOption,
} from '@ionic/react';
import { trashOutline } from 'ionicons/icons';

import { RowStack } from '../../common/Layout/styled';
import { useTr } from '../../../hooks/useTr';

import { Icon } from '../../common/styled';
import {
  QATextInput,
  QuestionSelect,
  Container,
  QuestionItemInput,
  QuestionItemInputContainer,
} from './styled';

type QuestionFormProps = {
  sentence: string;
  onCancel(): void;
  onSave(question: string, items: string[], isMultiselect: boolean): void;
};

export function QuestionForm({
  onCancel,
  onSave,
  sentence,
}: QuestionFormProps) {
  const { tr } = useTr();

  const inputRef = useRef<HTMLIonInputElement>(null);
  const textareaRef = useRef<HTMLIonTextareaElement>(null);

  const [questionItems, setQuestionItems] = useState<string[]>([]);
  const [showQuestionItemInput, setShowQuestionItemInput] =
    useState<boolean>(false);
  const [questionType, setQuestionType] = useState<
    'true/false' | 'agree/disagree' | 'multiselect' | 'chooseone' | 'text'
  >('true/false');

  const QUESTION_TYPES = [
    {
      label: tr('Text'),
      value: 'text',
    },
    {
      label: tr('True / False'),
      value: 'true/false',
    },
    {
      label: tr('Agree / Disagree'),
      value: 'agree/disagree',
    },
    {
      label: tr('Multiselect'),
      value: 'multiselect',
    },
    {
      label: tr('Choose One'),
      value: 'chooseone',
    },
  ];

  const handleSaveQuestion = () => {
    if (!questionType) {
      alert('Not selected question type');
      return;
    }

    const question = textareaRef.current!.value
      ? textareaRef.current!.value.trim()
      : '';

    if (question === '') {
      alert('Please input question');
      return;
    }

    if (questionType === 'true/false') {
      onSave(question, ['true', 'false'], false);
      return;
    } else if (questionType === 'agree/disagree') {
      onSave(question, ['agree', 'disagree'], false);
      return;
    } else if (questionType === 'text') {
      onSave(question, [], false);
      return;
    }

    if (questionItems.length === 0) {
      alert('Please add question Items');
      return;
    }

    if (questionType === 'multiselect') {
      onSave(question, questionItems, true);
    } else if (questionType === 'chooseone') {
      onSave(question, questionItems, false);
    }
  };

  const handleAddQuestionItem = () => {
    const tempQuestionItem = inputRef.current!.value + '';

    if (tempQuestionItem.trim() === '') {
      alert('Cannot create Question Item with empty string');
      return;
    }

    setQuestionItems((_items) => {
      const exists = _items.find((item) => item === tempQuestionItem);

      if (exists) {
        return _items;
      }

      return [..._items, tempQuestionItem];
    });

    setShowQuestionItemInput(false);
  };

  const handleDeleteItem = (selectedItem: string) => {
    setQuestionItems((_items) =>
      _items.filter((item) => item !== selectedItem.trim()),
    );
  };

  const handleCancelAddingQuestionItem = () => {
    setShowQuestionItemInput(false);
  };

  const handleShowQuestionItemInput = () => {
    setShowQuestionItemInput(true);
  };

  const questionItemInputCom = showQuestionItemInput ? (
    <QuestionItemInputContainer>
      <QuestionItemInput placeholder="Input Question Item" ref={inputRef} />
      <IonButton fill="outline" onClick={handleAddQuestionItem}>
        {tr('Add')}
      </IonButton>
      <IonButton fill="clear" onClick={handleCancelAddingQuestionItem}>
        {tr('Cancel')}
      </IonButton>
    </QuestionItemInputContainer>
  ) : (
    <IonButton fill="clear" onClick={handleShowQuestionItemInput}>
      {tr('+ Add Question')}
    </IonButton>
  );

  return (
    <Container>
      <p>{sentence}</p>
      <IonLabel>{tr('Your Question')}:</IonLabel>

      <QuestionSelect
        placeholder={tr('Type of Question')}
        value={questionType}
        onIonChange={(e) => setQuestionType(e.detail.value)}
      >
        {QUESTION_TYPES.map((item) => (
          <IonSelectOption value={item.value} key={item.value}>
            {item.label}
          </IonSelectOption>
        ))}
      </QuestionSelect>

      <QATextInput
        ref={textareaRef}
        label={`${tr('Question')}...`}
        labelPlacement="floating"
        placeholder={`${tr('Question')}...`}
        rows={4}
      />

      {questionType === 'multiselect' || questionType === 'chooseone'
        ? questionItemInputCom
        : null}

      <IonList>
        {questionItems.map((item) => (
          <IonItem key={item}>
            <IonLabel>{item}</IonLabel>
            <Icon
              slot="end"
              icon={trashOutline}
              onClick={() => {
                handleDeleteItem(item);
              }}
            />
          </IonItem>
        ))}
      </IonList>

      <RowStack>
        <IonButton fill="outline" onClick={onCancel}>
          {tr('Cancel')}
        </IonButton>
        <IonButton onClick={handleSaveQuestion}>{tr('Save')}</IonButton>
      </RowStack>
    </Container>
  );
}
