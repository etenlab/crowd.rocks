import { useIonToast } from '@ionic/react';

import {
  useTogglePericopeTrVoteStatusMutation as useGeneratedTogglePericopeTrVoteStatusMutation,
  // useSubscribeToPericopeVoteStatusToggledSubscription as useGeneratedSubscribeToPericopeVoteStatusToggledSubscription,
} from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { useTr } from './useTr';
import { useUnauthorizedRedirect } from './useUnauthorizedRedirect';
import { updateCacheWithTogglePericopeTrVoteStatus } from '../cacheUpdators/togglePericopeTrVoteStatus';

export function useTogglePericopeTrVoteStatusMutation() {
  const { tr } = useTr();
  const [present] = useIonToast();
  const redirectOnUnauth = useUnauthorizedRedirect();

  return useGeneratedTogglePericopeTrVoteStatusMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.togglePericopeTrVoteStatus.vote_status &&
        data.togglePericopeTrVoteStatus.error === ErrorType.NoError
      ) {
        const newVoteStatus = data.togglePericopeTrVoteStatus.vote_status;
        const newBestTranslation =
          data.togglePericopeTrVoteStatus.best_translation;

        updateCacheWithTogglePericopeTrVoteStatus(
          cache,
          newVoteStatus,
          newBestTranslation,
        );
      } else {
        present({
          message: `${tr('Failed at voting!')} [${data
            ?.togglePericopeTrVoteStatus.error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        redirectOnUnauth(data?.togglePericopeTrVoteStatus.error);
      }
    },
  });
}
