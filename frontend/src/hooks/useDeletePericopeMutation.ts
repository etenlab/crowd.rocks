import { useIonToast } from '@ionic/react';

import { useDeletePericopeMutation as useGeneratedDeletePericopeMutation } from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { updateCacheWithDeletePericope } from '../cacheUpdators/deletePericope';

import { useTr } from './useTr';
import { useUnauthorizedRedirect } from './useUnauthorizedRedirect';

export function useDeletePericopeMutation() {
  const { tr } = useTr();
  const [present] = useIonToast();
  const redirectOnUnauth = useUnauthorizedRedirect();

  return useGeneratedDeletePericopeMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.deletePericopies.pericope_id &&
        data.deletePericopies.error === ErrorType.NoError
      ) {
        const pericope_id = data.deletePericopies.pericope_id;

        updateCacheWithDeletePericope(cache, pericope_id);
      } else {
        console.log('useDeletePericopeMutation: ', errors);
        console.log(data?.deletePericopies.error);

        present({
          message: `${tr('Failed at deleteing a Pericope!')} [${data
            ?.deletePericopies.error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        redirectOnUnauth(data?.deletePericopies.error);
      }
    },
  });
}
