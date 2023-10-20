import { useIonToast } from '@ionic/react';

import {
  TableNameType,
  useToggleFlagWithRefMutation as useGeneratedToggleFlagWithRefMutation,
} from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { useTr } from './useTr';
import { updateCacheWithToggleFlags } from '../cacheUpdators/toggleFlags';
import { useUnauthorizedRedirect } from './useUnauthorizedRedirect';

export function useToggleFlagWithRefMutation(
  parent_table: TableNameType,
  parent_id: string,
) {
  const { tr } = useTr();
  const [present] = useIonToast();
  const redirectOnUnauth = useUnauthorizedRedirect();

  return useGeneratedToggleFlagWithRefMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.toggleFlagWithRef.flags &&
        data.toggleFlagWithRef.error === ErrorType.NoError
      ) {
        const newFlags = data.toggleFlagWithRef.flags;

        updateCacheWithToggleFlags(cache, newFlags, parent_table, parent_id);
      } else {
        console.log('useToggleFlagWithRefMutation: ', errors);
        console.log(data?.toggleFlagWithRef.error);

        present({
          message: `${tr('Failed at toggle flag!')} [${data?.toggleFlagWithRef
            .error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        redirectOnUnauth(data?.toggleFlagWithRef.error);
      }
    },
  });
}
