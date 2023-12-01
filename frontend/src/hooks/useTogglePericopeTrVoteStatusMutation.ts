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
        data.togglePericopeTrVoteStatus.vote_status_list[0] &&
        data.togglePericopeTrVoteStatus.error === ErrorType.NoError
      ) {
        // note: index [0] is because we are toggling single vote related to one definite pericope_translaion_id
        // so we're expecting only single row.
        const newVoteStatus =
          data.togglePericopeTrVoteStatus.vote_status_list[0];
        const newBestTranslation =
          data.togglePericopeTrVoteStatus.best_translation_list[0];

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

// export function useSubscribeToPericopeVoteStatusToggledSubscription() {
//   return useGeneratedSubscribeToPericopeVoteStatusToggledSubscription({
//     onData({ client, data: result }) {
//       const { data, error } = result;
//       if (
//         !error &&
//         data &&
//         data.pericopeVoteStatusToggled.vote_status &&
//         data.pericopeVoteStatusToggled.error === ErrorType.NoError
//       ) {
//         const newVoteStatus = data.pericopeVoteStatusToggled.vote_status;

//         updateCacheWithTogglePericopeVoteStatus(client.cache, newVoteStatus);
//       }
//     },
//   });
// }
