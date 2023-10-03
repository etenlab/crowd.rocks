import { useState, useRef, useCallback } from 'react';
import {
  IonButton,
  IonItem,
  IonLabel,
  IonList,
  IonRadio,
  IonCheckbox,
  IonRadioGroup,
} from '@ionic/react';

import { RowStack } from '../../common/Layout/styled';
import { useTr } from '../../../hooks/useTr';

import { QuestionOnWordRange } from '../../../generated/graphql';

import { QATextInput, Container } from './styled';

function guessQuestionType(
  question_items: string[],
  isMultiselect: boolean,
): 'true/false' | 'agree/disagree' | 'multiselect' | 'chooseone' | 'text' {
  if (question_items.length === 0) {
    return 'text';
  }

  if (question_items.length === 2) {
    if (
      question_items.find((item) => item === 'true') &&
      question_items.find((item) => item === 'false')
    ) {
      return 'true/false';
    }

    if (
      question_items.find((item) => item === 'agree') &&
      question_items.find((item) => item === 'disagree')
    ) {
      return 'agree/disagree';
    }
  }

  if (isMultiselect) {
    return 'multiselect';
  } else {
    return 'chooseone';
  }
}

type AnswerFormProps = {
  question: QuestionOnWordRange;
  onCancel(): void;
  onSave(answer: string, itemIds: string[]): void;
};

export function AnswerForm({ onCancel, onSave, question }: AnswerFormProps) {
  const { tr } = useTr();

  const textareaRef = useRef<HTMLIonTextareaElement>(null);

  const [questionItemIds, setQuestionItemIds] = useState<string[]>([]);
  const [showMoreAnswerCom, setShowMoreAnswerCom] = useState<boolean>(false);

  const handleSaveTextAnswer = () => {
    const answer = (textareaRef.current?.value || '').trim();

    if (answer === '') {
      alert('Answer Not exists');
      return;
    }

    onSave(answer, []);
  };

  const handleSaveTrueOrFalseAnswer = (answer: 'true' | 'false') => {
    const questionItemId = question.question_items.find(
      (item) => item.item === answer,
    )?.question_item_id;

    if (!questionItemId) {
      alert('Answer Not exists');
      return;
    }

    onSave('', [questionItemId]);
  };

  const handleSaveAgreeOrDisagreeAnswer = (answer: 'agree' | 'disagree') => {
    const questionItemId = question.question_items.find(
      (item) => item.item === answer,
    )?.question_item_id;

    if (!questionItemId) {
      alert('Answer Not exists');
      return;
    }

    onSave('', [questionItemId]);
  };

  const handleSaveMultiselectAnswer = () => {
    const answer = (textareaRef.current?.value || '').trim();

    if (answer === '' && questionItemIds.length === 0) {
      alert('Answer Not exists');
      return;
    }

    onSave(answer, questionItemIds);
  };

  const handleSaveChooseoneAnswer = () => {
    const answer = (textareaRef.current?.value || '').trim();

    if (answer === '' && questionItemIds.length === 0) {
      alert('Answer Not exists');
      return;
    }

    if (questionItemIds.length !== 1) {
      alert('Invalid Answer');
      return;
    }

    onSave(answer, questionItemIds);
  };

  const handleChangeChooseoneItem = useCallback((questionItemId: string) => {
    setQuestionItemIds([questionItemId]);
  }, []);

  const handleChangeMultiselectItem = useCallback((questionItemId: string) => {
    setQuestionItemIds((_questionItemIds) => {
      const exists = _questionItemIds.find((item) => item === questionItemId);

      if (exists) {
        return [..._questionItemIds.filter((item) => item !== questionItemId)];
      } else {
        return [..._questionItemIds, questionItemId];
      }
    });
  }, []);

  const questionType = guessQuestionType(
    question.question_items.map((item) => item.item),
    question.question_type_is_multiselect,
  );

  const textAnswerCom =
    questionType === 'text' ? (
      <>
        <QATextInput
          ref={textareaRef}
          label={`${tr('Answer')}...`}
          labelPlacement="floating"
          placeholder={`${tr('Enter your answer')}...`}
          rows={4}
        />
        <RowStack>
          <IonButton fill="outline" onClick={onCancel}>
            {tr('Cancel')}
          </IonButton>
          <IonButton onClick={handleSaveTextAnswer}>{tr('Send')}</IonButton>
        </RowStack>
      </>
    ) : null;

  const trueOrFalseAnswerCom =
    questionType === 'true/false' ? (
      <>
        <RowStack>
          <IonButton
            color="success"
            onClick={() => handleSaveTrueOrFalseAnswer('true')}
          >
            {tr('True')}
          </IonButton>
          <IonButton
            color="danger"
            onClick={() => handleSaveTrueOrFalseAnswer('false')}
          >
            {tr('False')}
          </IonButton>
          <IonButton fill="clear" onClick={onCancel}>
            {tr('Not sure')}
          </IonButton>
        </RowStack>
      </>
    ) : null;

  const agreeOrDisagreeAnswerCom =
    questionType === 'agree/disagree' ? (
      <>
        <RowStack>
          <IonButton
            color="success"
            onClick={() => handleSaveAgreeOrDisagreeAnswer('agree')}
          >
            {tr('Agree')}
          </IonButton>
          <IonButton
            color="danger"
            onClick={() => handleSaveAgreeOrDisagreeAnswer('disagree')}
          >
            {tr('Disagree')}
          </IonButton>
          <IonButton fill="clear" onClick={onCancel}>
            {tr('Not sure')}
          </IonButton>
        </RowStack>
      </>
    ) : null;

  const addMoreAnswerCom = (
    <>
      {!showMoreAnswerCom ? (
        <IonButton fill="clear" onClick={() => setShowMoreAnswerCom(true)}>
          + {tr('Add More Answer')} {`(${tr('Optional')})`}
        </IonButton>
      ) : null}

      {showMoreAnswerCom ? (
        <QATextInput
          ref={textareaRef}
          label={`${tr('Question')}...`}
          labelPlacement="floating"
          placeholder={`${tr('Question')}...`}
          rows={4}
        />
      ) : null}
    </>
  );

  const multiselectAnswerCom =
    questionType === 'multiselect' ? (
      <>
        <IonList>
          {question.question_items.map((questionItem) => (
            <IonItem key={questionItem.item}>
              <IonCheckbox
                slot="start"
                checked={
                  !!questionItemIds.find(
                    (id) => id === questionItem.question_item_id,
                  )
                }
                onIonChange={(e) => {
                  e.stopPropagation();
                  handleChangeMultiselectItem(questionItem.question_item_id);
                }}
              />
              <IonLabel>{questionItem.item}</IonLabel>
            </IonItem>
          ))}
        </IonList>
        {addMoreAnswerCom}
        <RowStack>
          <IonButton fill="outline" onClick={onCancel}>
            {tr('Cancel')}
          </IonButton>
          <IonButton onClick={handleSaveMultiselectAnswer}>
            {tr('Send')}
          </IonButton>
        </RowStack>
      </>
    ) : null;

  const choooseoneAnswerCom =
    questionType === 'chooseone' ? (
      <>
        <IonList>
          <IonRadioGroup value={questionItemIds[0] || undefined}>
            {question.question_items.map((questionItem) => (
              <IonItem
                key={questionItem.item}
                onClick={() =>
                  handleChangeChooseoneItem(questionItem.question_item_id)
                }
              >
                <IonRadio slot="start" value={questionItem.question_item_id} />
                <IonLabel>{questionItem.item}</IonLabel>
              </IonItem>
            ))}
          </IonRadioGroup>
        </IonList>
        {addMoreAnswerCom}
        <RowStack>
          <IonButton fill="outline" onClick={onCancel}>
            {tr('Cancel')}
          </IonButton>
          <IonButton onClick={handleSaveChooseoneAnswer}>
            {tr('Send')}
          </IonButton>
        </RowStack>
      </>
    ) : null;

  return (
    <Container>
      <IonLabel>{tr('Help the translator')}:</IonLabel>

      {textAnswerCom}
      {trueOrFalseAnswerCom}
      {agreeOrDisagreeAnswerCom}
      {multiselectAnswerCom}
      {choooseoneAnswerCom}
    </Container>
  );
}
