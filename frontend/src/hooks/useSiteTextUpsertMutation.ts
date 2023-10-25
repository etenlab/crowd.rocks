import { useIonToast } from '@ionic/react';

import { useSiteTextUpsertMutation as useGeneratedSiteTextUpsertMutation } from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { updateCacheWithUpsertSiteText } from '../cacheUpdators/upsertSiteText';

import { useTr } from '../hooks/useTr';
import { useUnauthorizedRedirect } from './useUnauthorizedRedirect';

export function useSiteTextUpsertMutation() {
  const { tr } = useTr();
  const [present] = useIonToast();
  const redirectOnUnauth = useUnauthorizedRedirect();

  return useGeneratedSiteTextUpsertMutation({
    update(cache, { data: upsertData, errors }) {
      if (
        !errors &&
        upsertData &&
        upsertData.siteTextUpsert.error === ErrorType.NoError
      ) {
        const newSiteTextDefinition =
          upsertData.siteTextUpsert.site_text_definition;

        if (!newSiteTextDefinition) {
          return;
        }

        updateCacheWithUpsertSiteText(cache, newSiteTextDefinition);

        present({
          message: tr('Success at creating new site text!'),
          duration: 1500,
          position: 'top',
          color: 'success',
        });
      } else {
        console.log('useSiteTextUpsertMutation: ', errors);
        console.log(upsertData?.siteTextUpsert.error);

        present({
          message: `${tr('Failed at creating new site text!')} [${
            upsertData?.siteTextUpsert.error || ''
          }]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        redirectOnUnauth(upsertData?.siteTextUpsert.error);
      }
    },
  });
}
