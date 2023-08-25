import { useIonToast } from '@ionic/react';

import { usePhraseUpsertMutation as useGeneratedPhraseUpsertMutation } from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { updateCacheWithUpsertPhrase } from '../cacheUpdators/upsertPhrase';

import { useTr } from '../hooks/useTr';

export function usePhraseUpsertMutation() {
  const { tr } = useTr();
  const [present] = useIonToast();

  return useGeneratedPhraseUpsertMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.phraseUpsert.phrase &&
        data.phraseUpsert.error === ErrorType.NoError
      ) {
        const newPhrase = data.phraseUpsert.phrase;

        updateCacheWithUpsertPhrase(cache, newPhrase);

        present({
          message: tr('Success at creating new phrase!'),
          duration: 1500,
          position: 'top',
          color: 'success',
        });
      } else {
        console.log('usePhraseUpsertMutation: ', errors);
        console.log(data?.phraseUpsert.error);

        present({
          message: `${tr('Failed at creating new phrase!')} [${data
            ?.phraseUpsert.error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
      }
    },
  });
}
