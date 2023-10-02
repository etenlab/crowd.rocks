import {
  IonItem,
  IonLabel,
  IonList,
  IonRadio,
  IonCheckbox,
  IonListHeader,
  IonRadioGroup,
} from '@ionic/react';

import { useTr } from '../../../hooks/useTr';

import { Answer, QuestionOnWordRange } from '../../../generated/graphql';

type AnswerItemProps = {
  question: QuestionOnWordRange;
  answer: Answer;
};

export function AnswerItem({ question, answer }: AnswerItemProps) {
  const { tr } = useTr();

  const checkedBox = <IonCheckbox checked disabled slot="start" />;
  const nonCheckBox = <IonCheckbox disabled slot="start" />;

  const checkedBoxComs = question.question_type_is_multiselect
    ? question.question_items.map((item) => (
        <IonItem key={item.item}>
          {answer.question_items.find(
            (answerItem) => answerItem.item === item.item,
          )
            ? checkedBox
            : nonCheckBox}
          <IonLabel>{item.item}</IonLabel>
        </IonItem>
      ))
    : null;

  const radioButtonCom = !question.question_type_is_multiselect ? (
    <IonRadioGroup value={answer.question_items[0]?.question_item_id}>
      {question.question_items.map((item) => (
        <IonItem key={item.question_item_id}>
          <IonRadio value={item.question_item_id} disabled />
          <IonLabel>{item.item}</IonLabel>
        </IonItem>
      ))}
    </IonRadioGroup>
  ) : null;

  return (
    <IonList>
      <IonListHeader>
        <IonLabel>{`${tr('Created by')} : ${answer.created_by}`}</IonLabel>
      </IonListHeader>
      <p>{answer.answer}</p>
      {checkedBoxComs}
      {radioButtonCom}
    </IonList>
  );
}
