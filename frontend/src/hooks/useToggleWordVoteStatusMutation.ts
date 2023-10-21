import { useIonToast } from '@ionic/react';

import { useToggleWordVoteStatusMutation as useGeneratedToggleWordVoteStatusMutation } from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { updateCacheWithToggleWordVoteStatus } from '../cacheUpdators/toggleWordVoteStatus';

import { useTr } from '../hooks/useTr';
import { useUnauthorizedRedirect } from './useUnauthorizedRedirect';

export function useToggleWordVoteStatusMutation() {
  const { tr } = useTr();
  const [present] = useIonToast();
  const redirectOnUnauth = useUnauthorizedRedirect();

  return useGeneratedToggleWordVoteStatusMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.toggleWordVoteStatus.vote_status &&
        data.toggleWordVoteStatus.error === ErrorType.NoError
      ) {
        const newVoteStatus = data.toggleWordVoteStatus.vote_status;

        updateCacheWithToggleWordVoteStatus(cache, newVoteStatus);
      } else {
        console.log('useToggleWordVoteStatusMutation: ', errors);
        console.log(data?.toggleWordVoteStatus.error);

        present({
          message: `${tr('Failed at voting!')} [${data?.toggleWordVoteStatus
            .error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        redirectOnUnauth(data?.toggleWordVoteStatus.error);
      }
    },
  });
}
