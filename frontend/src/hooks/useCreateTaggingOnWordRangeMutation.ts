import { useIonToast } from '@ionic/react';
import {
  useCreateTaggingOnWordRangeMutation as useGeneratedCreateTaggingOnWordRangeMutation,
  useSubscribeToWordRangeTagWithVoteAddedSubscription as useGeneratedSubscribeToWordRangeTagWithVoteAddedSubscription,
} from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { useTr } from './useTr';

import { updateCacheWithCreateWordRangeTags } from '../cacheUpdators/createWordRangeTag';
import { useUnauthorizedRedirect } from './useUnauthorizedRedirect';

export function useCreateTaggingOnWordRangeMutation() {
  const { tr } = useTr();
  const [present] = useIonToast();
  const redirectOnUnauth = useUnauthorizedRedirect();

  return useGeneratedCreateTaggingOnWordRangeMutation({
    update(_cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.createTaggingOnWordRange.word_range_tags.length > 0 &&
        data.createTaggingOnWordRange.error === ErrorType.NoError
      ) {
        present({
          message: `${tr('Success at creating new tags!')}`,
          duration: 1500,
          position: 'top',
          color: 'success',
        });
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

export function useSubscribeToWordRangeTagWithVoteAddedSubscription() {
  return useGeneratedSubscribeToWordRangeTagWithVoteAddedSubscription({
    onData({ client, data: result }) {
      const { data, error } = result;
      if (
        !error &&
        data &&
        data.wordRangeTagWithVoteAdded.word_range_tags.length > 0 &&
        data.wordRangeTagWithVoteAdded.error === ErrorType.NoError
      ) {
        const new_word_range_tags =
          data.wordRangeTagWithVoteAdded.word_range_tags;

        updateCacheWithCreateWordRangeTags(client.cache, new_word_range_tags);
      }
    },
  });
}
