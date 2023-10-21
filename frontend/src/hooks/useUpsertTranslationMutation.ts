import { useIonToast } from '@ionic/react';

import { useUpsertTranslationMutation as useGeneratedUpsertTranslationMutation } from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { updateCacheWithUpsertTranslation } from '../cacheUpdators/upsertTranslation';

import { useTr } from './useTr';
import { useUnauthorizedRedirect } from './useUnauthorizedRedirect';

export function useUpsertTranslationMutation() {
  const { tr } = useTr();
  const [present] = useIonToast();
  const redirectOnUnauth = useUnauthorizedRedirect();

  return useGeneratedUpsertTranslationMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.upsertTranslation.error === ErrorType.NoError
      ) {
        const newTranslation = data.upsertTranslation.translation;

        if (!newTranslation) {
          return;
        }

        updateCacheWithUpsertTranslation(cache, newTranslation);

        present({
          message: tr('Success at creating new translation!'),
          duration: 1500,
          position: 'top',
          color: 'success',
        });
      } else {
        console.log('useUpsertTranslationMutation: ', errors);
        console.log(data?.upsertTranslation.error);

        present({
          message: `${tr('Failed at creating new translation!')} [${data
            ?.upsertTranslation.error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        redirectOnUnauth(data?.upsertTranslation.error);
      }
    },
  });
}
