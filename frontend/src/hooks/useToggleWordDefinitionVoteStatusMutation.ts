import { useIonToast } from '@ionic/react';

import { useToggleWordDefinitionVoteStatusMutation as useGeneratedToggleWordDefinitonVoteStatusMutation } from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { updateCacheWithToggleWordDefinitionVoteStatus } from '../cacheUpdators/toggleWordDefinitionVoteStatus';

import { useTr } from '../hooks/useTr';

export function useToggleWordDefinitionVoteStatusMutation() {
  const { tr } = useTr();
  const [present] = useIonToast();

  return useGeneratedToggleWordDefinitonVoteStatusMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.toggleWordDefinitionVoteStatus.vote_status &&
        data.toggleWordDefinitionVoteStatus.error === ErrorType.NoError
      ) {
        const newVoteStatus = data.toggleWordDefinitionVoteStatus.vote_status;

        updateCacheWithToggleWordDefinitionVoteStatus(cache, newVoteStatus);
      } else {
        console.log('useToggleWordDefinitonVoteStatusMutation: ', errors);
        console.log(data?.toggleWordDefinitionVoteStatus.error);

        present({
          message: `${tr('Failed at voting!')} [${data
            ?.toggleWordDefinitionVoteStatus.error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
      }
    },
  });
}
