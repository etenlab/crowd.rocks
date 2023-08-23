import { useIonToast } from '@ionic/react';

import { useToggleSiteTextTranslationVoteStatusMutation as useGeneratedToggleSiteTextTranslationVoteStatusMutation } from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { updateCacheWithToggleSiteTextTranslationVoteStatus } from '../cacheUpdators/toggleSiteTextTranslationVoteStatus';

import { useTr } from '../hooks/useTr';

export function useToggleSiteTextTranslationVoteStatusMutation() {
  const { tr } = useTr();
  const [present] = useIonToast();

  return useGeneratedToggleSiteTextTranslationVoteStatusMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.toggleSiteTextTranslationVoteStatus.vote_status &&
        data.toggleSiteTextTranslationVoteStatus.error === ErrorType.NoError
      ) {
        const newVoteStatus =
          data.toggleSiteTextTranslationVoteStatus.vote_status;

        updateCacheWithToggleSiteTextTranslationVoteStatus(
          cache,
          newVoteStatus,
        );
      } else {
        console.log('useToggleSiteTextTranslationVoteStatusMutation: ', errors);
        console.log(data?.toggleSiteTextTranslationVoteStatus.error);

        present({
          message: `${tr('Failed at voting!')} [${data
            ?.toggleSiteTextTranslationVoteStatus.error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
      }
    },
  });
}
