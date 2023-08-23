import { useIonToast } from '@ionic/react';

import { useUpsertSiteTextTranslationMutation as useGeneratedUpsertSiteTextTranslationMutation } from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { updateCacheWithUpsertSiteTextTranslation } from '../cacheUpdators/upsertSiteTextTranslation';

import { useTr } from '../hooks/useTr';

export function useUpsertSiteTextTranslationMutation(
  site_text_id: number,
  site_text_type_is_word: boolean,
  langInfo: LanguageInfo,
) {
  const { tr } = useTr();
  const [present] = useIonToast();

  return useGeneratedUpsertSiteTextTranslationMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.upsertSiteTextTranslation.error === ErrorType.NoError
      ) {
        const newTranslation = data.upsertSiteTextTranslation.translation;

        if (!newTranslation) {
          return;
        }

        updateCacheWithUpsertSiteTextTranslation(cache, {
          newTranslation,
          site_text_id,
          site_text_type_is_word,
          langInfo,
        });

        present({
          message: tr('Success at creating new site text translation!'),
          duration: 1500,
          position: 'top',
          color: 'success',
        });
      } else {
        console.log('useUpsertSiteTextTranslationMutation: ', errors);
        console.log(data?.upsertSiteTextTranslation.error);

        present({
          message: `${tr(
            'Failed at creating new site text translation!',
          )} [${data?.upsertSiteTextTranslation.error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
      }
    },
  });
}
