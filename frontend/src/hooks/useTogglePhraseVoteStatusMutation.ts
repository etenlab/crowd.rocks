import { useIonToast } from '@ionic/react';

import { useTogglePhraseVoteStatusMutation as useGeneratedTogglePhraseVoteStatusMutation } from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { updateCacheWithTogglePhraseVoteStatus } from '../cacheUpdators/togglePhraseVoteStatus';

import { useTr } from '../hooks/useTr';
import { useUnauthorizedRedirect } from './useUnauthorizedRedirect';

export function useTogglePhraseVoteStatusMutation() {
  const { tr } = useTr();
  const [present] = useIonToast();
  const redirectOnUnauth = useUnauthorizedRedirect();

  return useGeneratedTogglePhraseVoteStatusMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.togglePhraseVoteStatus.vote_status &&
        data.togglePhraseVoteStatus.error === ErrorType.NoError
      ) {
        const newVoteStatus = data.togglePhraseVoteStatus.vote_status;

        updateCacheWithTogglePhraseVoteStatus(cache, newVoteStatus);
      } else {
        console.log('useTogglePhraseVoteStatusMutation: ', errors);
        console.log(data?.togglePhraseVoteStatus.error);

        present({
          message: `${tr('Failed at voting!')} [${data?.togglePhraseVoteStatus
            .error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        redirectOnUnauth(data?.togglePhraseVoteStatus.error);
      }
    },
  });
}
