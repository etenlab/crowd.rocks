import { useIonToast } from '@ionic/react';

import {
  useUpsertAnswerMutation as useGeneratedUpsertAnswerMutation,
  useSubscribeToAnswersAddedSubscription as useGeneratedSubscribeToAnswersAddedSubscription,
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
    update(_cache, { data, errors }) {
      if (errors || !data || data.upsertAnswers.error !== ErrorType.NoError) {
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
  });
}

export function useSubscribeToAnswersAddedSubscription() {
  return useGeneratedSubscribeToAnswersAddedSubscription({
    onData({ client, data: result }) {
      const { data, error } = result;
      if (
        !error &&
        data &&
        data.answersAdded.answers.length > 0 &&
        data.answersAdded.error === ErrorType.NoError
      ) {
        const newAnswer = data.answersAdded.answers[0]!;

        updateCacheWithUpsertAnswer(client.cache, newAnswer);
      }
    },
  });
}
