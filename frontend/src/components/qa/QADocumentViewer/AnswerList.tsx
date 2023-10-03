import { useState, useMemo } from 'react';
import { IonButton, IonLabel } from '@ionic/react';

import { useTr } from '../../../hooks/useTr';

import {
  ErrorType,
  Answer,
  QuestionOnWordRange,
  useGetAnswersByQuestionIdQuery,
} from '../../../generated/graphql';

import { Container } from './styled';
import { AnswerForm } from './AnswerForm';
import { AnswerItem } from './AnswerItem';

type AnswerListProps = {
  sentence: string;
  question: QuestionOnWordRange;
  onCancel(): void;
  onSave(answer: string, itemIds: string[]): void;
};

export function AnswerList({
  onCancel,
  onSave,
  sentence,
  question,
}: AnswerListProps) {
  const { tr } = useTr();

  const [showAnswerForm, setShowAnswerForm] = useState<boolean>(false);

  const { data, error, loading } = useGetAnswersByQuestionIdQuery({
    variables: {
      id: question.question_id,
    },
  });

  const answers = useMemo(() => {
    if (
      error ||
      !data ||
      data.getAnswersByQuestionIds.error !== ErrorType.NoError
    ) {
      return [];
    }

    return data.getAnswersByQuestionIds.answers.filter(
      (answer) => answer,
    ) as Answer[];
  }, [data, error]);

  const handleCancel = () => {
    setShowAnswerForm(false);
  };

  const handleSave = (answer: string, answerItemIds: string[]) => {
    setShowAnswerForm(false);
    onSave(answer, answerItemIds);
  };

  const handleGoToBack = () => {
    setShowAnswerForm(false);
    onCancel();
  };

  if (loading) {
    return <div>loading</div>;
  }

  if (error) {
    return <div>error</div>;
  }

  const answerForm = showAnswerForm ? (
    <AnswerForm
      onCancel={handleCancel}
      onSave={handleSave}
      question={question}
    />
  ) : null;

  return (
    <Container>
      <p>{sentence}</p>
      <IonLabel>{tr('Help the translator')}:</IonLabel>

      <p>{question.question}</p>

      {answers.map((answer) => (
        <AnswerItem
          key={answer.answer_id}
          answer={answer}
          question={question}
        />
      ))}

      <IonButton fill="clear" onClick={() => setShowAnswerForm(true)}>
        + {tr('Add More Answer')}
      </IonButton>

      {answerForm}

      <IonButton fill="clear" onClick={handleGoToBack}>
        {tr('Go to back')}
      </IonButton>
    </Container>
  );
}
