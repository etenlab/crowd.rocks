import { useIonToast } from '@ionic/react';

import { useToggleMapVoteStatusMutation as useGeneratedToggleMapVoteStatusMutation } from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { updateCacheWithToggleMapVoteStatus } from '../cacheUpdators/toggleMapVoteStatus';

import { useTr } from '../hooks/useTr';

export function useToggleMapVoteStatusMutation() {
  const { tr } = useTr();
  const [present] = useIonToast();

  return useGeneratedToggleMapVoteStatusMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.toggleMapVoteStatus.vote_status &&
        data.toggleMapVoteStatus.error === ErrorType.NoError
      ) {
        const newVoteStatus = data.toggleMapVoteStatus.vote_status;

        updateCacheWithToggleMapVoteStatus(cache, newVoteStatus);
      } else {
        console.log('useToggleMapVoteStatusMutation: ', errors);
        console.log(data?.toggleMapVoteStatus.error);

        present({
          message: `${tr('Failed at voting!')} [${data?.toggleMapVoteStatus
            .error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
      }
    },
  });
}
