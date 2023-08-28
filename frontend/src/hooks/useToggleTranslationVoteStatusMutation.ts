import { useIonToast } from '@ionic/react';

import { useToggleTranslationVoteStatusMutation as useGeneratedToggleTranslationVoteStatusMutation } from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { updateCacheWithToggleTranslationVoteStatus } from '../cacheUpdators/toggleTranslationVoteStatus';

import { useTr } from './useTr';

export function useToggleTranslationVoteStatusMutation() {
  const { tr } = useTr();
  const [present] = useIonToast();

  return useGeneratedToggleTranslationVoteStatusMutation({
    update(cache, { data, errors }) {
      if (
        errors ||
        !data ||
        data.toggleTranslationVoteStatus.error !== ErrorType.NoError
      ) {
        console.log('useToggleTranslationVoteStatusMutation: ', errors);
        console.log(data?.toggleTranslationVoteStatus.error);

        present({
          message: `${tr('Failed at voting!')} [${data
            ?.toggleTranslationVoteStatus.error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });

        return;
      }

      if (!data.toggleTranslationVoteStatus.translation_vote_status) {
        return;
      }

      const newVoteStatus =
        data.toggleTranslationVoteStatus.translation_vote_status;

      updateCacheWithToggleTranslationVoteStatus(cache, newVoteStatus);
    },
  });
}
