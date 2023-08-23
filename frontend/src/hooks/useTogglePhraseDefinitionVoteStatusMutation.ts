import { useIonToast } from '@ionic/react';

import { useTogglePhraseDefinitionVoteStatusMutation as useGeneratedTogglePhraseDefinitonVoteStatusMutation } from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { updateCacheWithTogglePhraseDefinitionVoteStatus } from '../cacheUpdators/togglePhraseDefinitionVoteStatus';
import { useTr } from './useTr';

export function useTogglePhraseDefinitonVoteStatusMutation() {
  const { tr } = useTr();
  const [present] = useIonToast();

  return useGeneratedTogglePhraseDefinitonVoteStatusMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.togglePhraseDefinitionVoteStatus.vote_status &&
        data.togglePhraseDefinitionVoteStatus.error === ErrorType.NoError
      ) {
        const newVoteStatus = data.togglePhraseDefinitionVoteStatus.vote_status;

        updateCacheWithTogglePhraseDefinitionVoteStatus(cache, newVoteStatus);
      } else {
        console.log('useTogglePhraseDefinitonVoteStatusMutation: ', errors);
        console.log(data?.togglePhraseDefinitionVoteStatus.error);

        present({
          message: `${tr('Failed at voting!')} [${data
            ?.togglePhraseDefinitionVoteStatus.error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
      }
    },
  });
}
