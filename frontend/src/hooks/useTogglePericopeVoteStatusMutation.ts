import { useIonToast } from '@ionic/react';

import { useTogglePericopeVoteStatusMutation as useGeneratedTogglePericopeVoteStatusMutation } from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { updateCacheWithTogglePericopeVoteStatus } from '../cacheUpdators/togglePericopeVoteStatus';

import { useTr } from './useTr';
import { useUnauthorizedRedirect } from './useUnauthorizedRedirect';

export function useTogglePericopeVoteStatusMutation() {
  const { tr } = useTr();
  const [present] = useIonToast();
  const redirectOnUnauth = useUnauthorizedRedirect();

  return useGeneratedTogglePericopeVoteStatusMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.togglePericopeVoteStatus.vote_status &&
        data.togglePericopeVoteStatus.error === ErrorType.NoError
      ) {
        const newVoteStatus = data.togglePericopeVoteStatus.vote_status;

        updateCacheWithTogglePericopeVoteStatus(cache, newVoteStatus);
      } else {
        console.log('useTogglePericopeVoteStatusMutation: ', errors);
        console.log(data?.togglePericopeVoteStatus.error);

        present({
          message: `${tr('Failed at voting!')} [${data?.togglePericopeVoteStatus
            .error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        redirectOnUnauth(data?.togglePericopeVoteStatus.error);
      }
    },
  });
}
