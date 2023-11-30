import { useIonToast } from '@ionic/react';

import {
  useCreateQuestionOnWordRangeMutation as useGeneratedCreateQuestionOnWordRangeMutation,
  useSubscribeToQuestionsOnWordRangeAddedSubscription as useGeneratedSubscribeToQuestionsOnWordRangeAddedSubscription,
} from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { updateCacheWithCreateQuestionOnWordRange } from '../cacheUpdators/createQuestionOnWordRange';

import { useTr } from './useTr';
import { useUnauthorizedRedirect } from './useUnauthorizedRedirect';

export function useCreateQuestionOnWordRangeMutation() {
  const { tr } = useTr();
  const [present] = useIonToast();
  const redirectOnUnauth = useUnauthorizedRedirect();

  return useGeneratedCreateQuestionOnWordRangeMutation({
    update(_cache, { data, errors }) {
      if (
        errors ||
        !data ||
        data.createQuestionOnWordRange.error !== ErrorType.NoError
      ) {
        console.log('useCreateQuestionOnWordRangeMutation: ', errors);
        console.log(data?.createQuestionOnWordRange.error);

        present({
          message: `${tr('Failed at creating new Question!')} [${data
            ?.createQuestionOnWordRange.error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        console.log(errors);
        console.log(data);
        redirectOnUnauth(data?.createQuestionOnWordRange.error);
      }
    },
  });
}

export function useSubscribeToQuestionsOnWordRangeAddedSubscription() {
  return useGeneratedSubscribeToQuestionsOnWordRangeAddedSubscription({
    onData({ client, data: result }) {
      const { data, error } = result;
      if (
        !error &&
        data &&
        data.questionsOnWordRangeAdded.questions.length === 1 &&
        data.questionsOnWordRangeAdded.error === ErrorType.NoError
      ) {
        const newQuestion = data.questionsOnWordRangeAdded.questions[0]!;

        updateCacheWithCreateQuestionOnWordRange(client.cache, newQuestion);
      }
    },
  });
}
