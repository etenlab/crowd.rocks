import { useIonToast } from '@ionic/react';
import { useWordUpsertMutation as useGeneratedWordUpsertMutation } from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { updateCacheWithUpsertWord } from '../cacheUpdators/upsertWord';

import { useTr } from '../hooks/useTr';
import { useUnauthorizedRedirect } from './useUnauthorizedRedirect';

export function useWordUpsertMutation() {
  const { tr } = useTr();
  const [present] = useIonToast();
  const redirectOnUnauth = useUnauthorizedRedirect();

  return useGeneratedWordUpsertMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.wordUpsert.word &&
        data.wordUpsert.error === ErrorType.NoError
      ) {
        const newWord = data.wordUpsert.word;

        updateCacheWithUpsertWord(cache, newWord);

        present({
          message: tr('Success at creating new word!'),
          duration: 1500,
          position: 'top',
          color: 'success',
        });
      } else {
        console.log('useWordUpsertMutation: ', errors);
        console.log(data?.wordUpsert.error);

        present({
          message: `${tr('Failed at creating new word!')} [${data?.wordUpsert
            .error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        redirectOnUnauth(data?.wordUpsert.error);
      }
    },
  });
}
