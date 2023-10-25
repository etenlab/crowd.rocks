import { useIonToast } from '@ionic/react';

import { useUpsertPericopeMutation as useGeneratedUpsertPericopeMutation } from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { updateCacheWithUpsertPericope } from '../cacheUpdators/upsertPericope';

import { useTr } from './useTr';
import { useUnauthorizedRedirect } from './useUnauthorizedRedirect';

export function useUpsertPericopeMutation(documentId: string) {
  const { tr } = useTr();
  const [present] = useIonToast();
  const redirectOnUnauth = useUnauthorizedRedirect();

  return useGeneratedUpsertPericopeMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.upsertPericopies.pericopies.length > 0 &&
        data.upsertPericopies.error === ErrorType.NoError
      ) {
        const newPericope = data.upsertPericopies.pericopies[0]!;

        updateCacheWithUpsertPericope(cache, newPericope, documentId);

        present({
          message: tr('Success at creating new Pericope!'),
          duration: 1500,
          position: 'top',
          color: 'success',
        });
      } else {
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
