import { useIonToast } from '@ionic/react';
import { useCreateTaggingOnWordRangeMutation as useGeneratedCreateTaggingOnWordRangeMutation } from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { useTr } from './useTr';

import { updateCacheWithCreateWordRangeTags } from '../cacheUpdators/createWordRangeTag';
import { useUnauthorizedRedirect } from './useUnauthorizedRedirect';

export function useCreateTaggingOnWordRangeMutation() {
  const { tr } = useTr();
  const [present] = useIonToast();
  const redirectOnUnauth = useUnauthorizedRedirect();

  return useGeneratedCreateTaggingOnWordRangeMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.createTaggingOnWordRange.word_range_tags.length > 0 &&
        data.createTaggingOnWordRange.error === ErrorType.NoError
      ) {
        const new_word_range_tags =
          data.createTaggingOnWordRange.word_range_tags;

        updateCacheWithCreateWordRangeTags(cache, new_word_range_tags);
      } else {
        console.log('useCreateTaggingOnWordRangeMutation: ', errors);
        console.log(data?.createTaggingOnWordRange.error);

        present({
          message: `${tr('Failed at creating new tagging!')} [${data
            ?.createTaggingOnWordRange.error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        redirectOnUnauth(data?.createTaggingOnWordRange.error);
      }
    },
  });
}
