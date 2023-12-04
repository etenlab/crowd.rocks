import { useIonToast } from '@ionic/react';

import { useAddPericopeTrMutation as useGeneratedAddPericopeTrMutation } from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { useTr } from './useTr';
import { useUnauthorizedRedirect } from './useUnauthorizedRedirect';
import { updateCacheWithAddPrericopeTr } from '../cacheUpdators/addPrericopeTr';

export function useAddPericopeTrMutation() {
  const { tr } = useTr();
  const [present] = useIonToast();
  const redirectOnUnauth = useUnauthorizedRedirect();

  return useGeneratedAddPericopeTrMutation({
    onError: (error) => {
      console.log(error);
      present({
        message: tr('Error with creating translation for pericope'),
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
    },
    update(cache, { data, errors }) {
      if (!errors && data && data.addPericopeTr.pericope_translation_id) {
        const newTranslation = data.addPericopeTr;

        if (!newTranslation) {
          return;
        }

        updateCacheWithAddPrericopeTr(cache, newTranslation);

        present({
          message: tr('Success at creating new translation!'),
          duration: 1500,
          position: 'top',
          color: 'success',
        });
      } else {
        console.log('useUpsertTranslationMutation: ', errors);

        present({
          message: `${tr('Failed at creating new translation!')}`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        redirectOnUnauth(ErrorType.PericopeTranslationInsertFailed);
      }
    },
  });
}
