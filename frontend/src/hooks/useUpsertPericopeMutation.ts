import { useIonToast } from '@ionic/react';

import {
  useUpsertPericopeMutation as useGeneratedUpsertPericopeMutation,
  useSubscribeToPericopiesAddedSubscription as useGeneratedSubscribeToPericopiesAddedSubscription,
} from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { updateCacheWithUpsertPericope } from '../cacheUpdators/upsertPericope';

import { useTr } from './useTr';
import { useUnauthorizedRedirect } from './useUnauthorizedRedirect';

export function useUpsertPericopeMutation() {
  const { tr } = useTr();
  const [present] = useIonToast();
  const redirectOnUnauth = useUnauthorizedRedirect();

  return useGeneratedUpsertPericopeMutation({
    update(_cache, { data, errors }) {
      if (
        errors ||
        !data ||
        data.upsertPericopies.error !== ErrorType.NoError
      ) {
        console.log('useUpsertPericopeMutation: ', errors);
        console.log(data?.upsertPericopies.error);

        present({
          message: `${tr('Failed at creating new Pericope!')} [${data
            ?.upsertPericopies.error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        redirectOnUnauth(data?.upsertPericopies.error);
      }
    },
  });
}

export function useSubscribeToPericopiesAddedSubscription() {
  return useGeneratedSubscribeToPericopiesAddedSubscription({
    onData({ client, data: result }) {
      const { data, error } = result;
      if (
        !error &&
        data &&
        data.pericopiesAdded.pericopies.length > 0 &&
        data.pericopiesAdded.error === ErrorType.NoError
      ) {
        const newPericope = data.pericopiesAdded.pericopies[0]!;

        updateCacheWithUpsertPericope(client.cache, newPericope);
      }
    },
  });
}
