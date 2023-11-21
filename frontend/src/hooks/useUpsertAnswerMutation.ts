import { useIonToast } from '@ionic/react';

import {
  GetQuestionStatisticDocument,
  useUpsertAnswerMutation as useGeneratedUpsertAnswerMutation,
} from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { updateCacheWithUpsertAnswer } from '../cacheUpdators/upsertAnswer';

import { useTr } from './useTr';
import { useUnauthorizedRedirect } from './useUnauthorizedRedirect';

export function useUpsertAnswerMutation() {
  const { tr } = useTr();
  const [present] = useIonToast();
  const redirectOnUnauth = useUnauthorizedRedirect();

  return useGeneratedUpsertAnswerMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.upsertAnswers.answers.length > 0 &&
        data.upsertAnswers.error === ErrorType.NoError
      ) {
        const newAnswer = data.upsertAnswers.answers[0]!;

        updateCacheWithUpsertAnswer(cache, newAnswer);
      } else {
        console.log('useUpsertAnswerMutation: ', errors);
        console.log(data?.upsertAnswers.error);

        present({
          message: `${tr('Failed at creating new Answer!')} [${data
            ?.upsertAnswers.error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        redirectOnUnauth(data?.upsertAnswers.error);
      }
    },
    refetchQueries: [GetQuestionStatisticDocument],
  });
}
