import { useIonToast } from '@ionic/react';

import { useToggleWordRangeTagVoteStatusMutation as useGeneratedToggleWordRangeTagVoteStatusMutation } from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { updateCacheWithToggleWordRangeTagVoteStatus } from '../cacheUpdators/toggleWordRangeTagVoteStatus';

import { useTr } from './useTr';
import { useUnauthorizedRedirect } from './useUnauthorizedRedirect';

export function useToggleWordRangeTagVoteStatusMutation() {
  const { tr } = useTr();
  const [present] = useIonToast();
  const redirectOnUnauth = useUnauthorizedRedirect();

  return useGeneratedToggleWordRangeTagVoteStatusMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.toggleWordRangeTagVoteStatus.vote_status &&
        data.toggleWordRangeTagVoteStatus.error === ErrorType.NoError
      ) {
        const newVoteStatus = data.toggleWordRangeTagVoteStatus.vote_status;

        updateCacheWithToggleWordRangeTagVoteStatus(cache, newVoteStatus);
      } else {
        console.log('useToggleWordRangeTagVoteStatusMutation: ', errors);
        console.log(data?.toggleWordRangeTagVoteStatus.error);

        present({
          message: `${tr('Failed at voting!')} [${data
            ?.toggleWordRangeTagVoteStatus.error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        redirectOnUnauth(data?.toggleWordRangeTagVoteStatus.error);
      }
    },
  });
}
