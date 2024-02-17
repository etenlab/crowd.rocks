import { useIonToast } from '@ionic/react';

import { useUpsertPhraseDefinitionFromPhraseAndDefinitionlikeStringMutation as useGeneratedUpsertPhraseDefinitionFromPhraseAndDefinitionlikeStringMutation } from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { updateCacheWithUpsertPhrase } from '../cacheUpdators/upsertPhrase';
import { updateCacheWithUpsertPhraseDefinition } from '../cacheUpdators/upsertPhraseDefinition';

import { useTr } from './useTr';
import { useUnauthorizedRedirect } from './useUnauthorizedRedirect';

export function useUpsertPhraseDefinitionFromPhraseAndDefinitionlikeStringMutation() {
  const { tr } = useTr();
  const [present] = useIonToast();
  const redirectOnUnauth = useUnauthorizedRedirect();

  return useGeneratedUpsertPhraseDefinitionFromPhraseAndDefinitionlikeStringMutation(
    {
      update(cache, { data, errors }) {
        if (
          !errors &&
          data &&
          data.upsertPhraseDefinitionFromPhraseAndDefinitionlikeString
            .phrase_definition &&
          data.upsertPhraseDefinitionFromPhraseAndDefinitionlikeString.error ===
            ErrorType.NoError
        ) {
          const newDefinition =
            data.upsertPhraseDefinitionFromPhraseAndDefinitionlikeString
              .phrase_definition;

          updateCacheWithUpsertPhrase(cache, newDefinition.phrase);
          updateCacheWithUpsertPhraseDefinition(cache, newDefinition);

          present({
            message: tr(
              'Success at creating a new phrase and phrase definition!',
            ),
            duration: 1500,
            position: 'top',
            color: 'success',
          });
        } else {
          console.log(
            'useUpsertPhraseDefinitionFromPhraseAndDefinitionlikeStringMutation: ',
            errors,
          );
          console.log(
            data?.upsertPhraseDefinitionFromPhraseAndDefinitionlikeString.error,
          );

          present({
            message: `${tr(
              'Failed at creating a new phrase and phrase definition!',
            )} [${data?.upsertPhraseDefinitionFromPhraseAndDefinitionlikeString
              .error}]`,
            duration: 1500,
            position: 'top',
            color: 'danger',
          });
          redirectOnUnauth(
            data?.upsertPhraseDefinitionFromPhraseAndDefinitionlikeString.error,
          );
        }
      },
    },
  );
}
