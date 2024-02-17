import { useIonToast } from '@ionic/react';

import { usePhraseDefinitionUpsertMutation as useGeneratedPhraseDefinitionUpsertMutation } from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { updateCacheWithUpsertPhraseDefinition } from '../cacheUpdators/upsertPhraseDefinition';

import { useTr } from '../hooks/useTr';
import { useUnauthorizedRedirect } from './useUnauthorizedRedirect';

export function usePhraseDefinitionUpsertMutation() {
  const { tr } = useTr();
  const [present] = useIonToast();
  const redirectOnUnauth = useUnauthorizedRedirect();

  return useGeneratedPhraseDefinitionUpsertMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.phraseDefinitionUpsert.phrase_definition &&
        data.phraseDefinitionUpsert.error === ErrorType.NoError
      ) {
        const newDefinition = data.phraseDefinitionUpsert.phrase_definition;

        updateCacheWithUpsertPhraseDefinition(cache, newDefinition);
        present({
          message: tr('Success at creating new phrase definition!'),
          duration: 1500,
          position: 'top',
          color: 'success',
        });
      } else {
        console.log('usePhraseDefinitionUpsertMutation: ', errors);
        console.log(data?.phraseDefinitionUpsert.error);

        present({
          message: `${tr('Failed at creating new phrase definition!')} [${data
            ?.phraseDefinitionUpsert.error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        redirectOnUnauth(data?.phraseDefinitionUpsert.error);
      }
    },
  });
}
