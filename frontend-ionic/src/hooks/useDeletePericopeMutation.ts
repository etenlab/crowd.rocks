import { useIonToast } from '@ionic/react';

import {
  useDeletePericopeMutation as useGeneratedDeletePericopeMutation,
  useSubscribeToPericopieDeletedSubscription as useGeneratedSubscribeToPericopieDeletedSubscription,
} from '../generated/graphql';

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
        errors ||
        !data ||
        !data.deletePericopie.pericope_id ||
        data.deletePericopie.error !== ErrorType.NoError
      ) {
        console.log('useDeletePericopeMutation: ', errors);
        console.log(data?.deletePericopie.error);

        present({
          message: `${tr('Failed at deleteing a Pericope!')} [${data
            ?.deletePericopie.error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        redirectOnUnauth(data?.deletePericopie.error);
      }
    },
  });
}

export function useSubscribeToPericopieDeletedSubscription() {
  return useGeneratedSubscribeToPericopieDeletedSubscription({
    onData({ client, data: result }) {
      const { data, error } = result;
      if (
        !error &&
        data &&
        data.pericopeDeleted.pericope_id &&
        data.pericopeDeleted.error === ErrorType.NoError
      ) {
        const pericope_id = data.pericopeDeleted.pericope_id;

        updateCacheWithDeletePericope(client.cache, pericope_id);
      }
    },
  });
}
