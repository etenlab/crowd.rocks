import { IonList, IonItem, IonLabel } from '@ionic/react';

import { QuestionOnWordRange } from '../../../generated/graphql';

type QuestionsMenuProps = {
  questions: QuestionOnWordRange[];
  onSelectQuestion(question: QuestionOnWordRange): void;
};

export function QuestionsMenu({
  questions,
  onSelectQuestion,
}: QuestionsMenuProps) {
  return (
    <IonList>
      {questions.map((question) => (
        <IonItem
          key={question.question_id}
          onClick={() => onSelectQuestion(question)}
        >
          <IonLabel>{question.question}</IonLabel>
        </IonItem>
      ))}
    </IonList>
  );
}
