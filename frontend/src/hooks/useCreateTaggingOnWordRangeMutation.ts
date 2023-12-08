import { useIonToast } from '@ionic/react';
import {
  useCreateTaggingOnWordRangesMutation as useGeneratedCreateTaggingOnWordRangeMutation,
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
        data.createTaggingOnWordRanges.word_range_tags.length > 0 &&
        data.createTaggingOnWordRanges.error === ErrorType.NoError
      ) {
        present({
          message: `${tr('Success at creating new tags!')}`,
          duration: 1500,
          position: 'top',
          color: 'success',
        });
      } else {
        console.log('useCreateTaggingOnWordRangeMutations: ', errors);
        console.log(data?.createTaggingOnWordRanges.error);

        present({
          message: `${tr('Failed at creating new tagging!')} [${data
            ?.createTaggingOnWordRanges.error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        redirectOnUnauth(data?.createTaggingOnWordRanges.error);
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
