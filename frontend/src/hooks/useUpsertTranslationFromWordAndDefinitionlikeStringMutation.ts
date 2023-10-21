import { useIonToast } from '@ionic/react';
import {
  ErrorType,
  useUpsertTranslationFromWordAndDefinitionlikeStringMutation as useGeneratedUpsertTranslationFromWordAndDefinitionlikeStringMutation,
} from '../generated/graphql';

import { useTr } from './useTr';
import { useUnauthorizedRedirect } from './useUnauthorizedRedirect';

export function useUpsertTranslationFromWordAndDefinitionlikeStringMutation() {
  const { tr } = useTr();
  const [present] = useIonToast();
  const redirectOnUnauth = useUnauthorizedRedirect();
  return useGeneratedUpsertTranslationFromWordAndDefinitionlikeStringMutation({
    refetchQueries: ['GetTranslationsByFromDefinitionId'],
    update(cache, { data, errors }) {
      if (
        errors ||
        !data ||
        !data.upsertTranslationFromWordAndDefinitionlikeString.translation ||
        !(
          data.upsertTranslationFromWordAndDefinitionlikeString.error ===
          ErrorType.NoError
        )
      ) {
        console.log(
          'useUpsertTranslationFromWordAndDefinitionlikeStringMutation: ',
          errors,
        );
        console.log(
          data?.upsertTranslationFromWordAndDefinitionlikeString.error,
        );

        present({
          message: `${tr('Failed at creating new word definition!')} [${data
            ?.upsertTranslationFromWordAndDefinitionlikeString.error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        redirectOnUnauth(
          data?.upsertTranslationFromWordAndDefinitionlikeString.error,
        );
      }
    },
  });
}
