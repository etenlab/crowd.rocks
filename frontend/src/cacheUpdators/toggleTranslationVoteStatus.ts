import { ApolloCache } from '@apollo/client';

import {
  TranslationVoteStatus,
  WordToWordTranslationWithVote,
  WordToPhraseTranslationWithVote,
  PhraseToWordTranslationWithVote,
  PhraseToPhraseTranslationWithVote,
} from '../generated/graphql';
import {
  WordToWordTranslationWithVoteFragmentFragmentDoc,
  WordToPhraseTranslationWithVoteFragmentFragmentDoc,
  PhraseToWordTranslationWithVoteFragmentFragmentDoc,
  PhraseToPhraseTranslationWithVoteFragmentFragmentDoc,
} from '../generated/graphql';

export function updateCacheWithToggleTranslationVoteStatus(
  cache: ApolloCache<unknown>,
  newVoteStatus: TranslationVoteStatus,
) {
  switch (newVoteStatus.__typename) {
    case 'WordTrVoteStatus': {
      cache.updateFragment<WordToWordTranslationWithVote>(
        {
          id: cache.identify({
            __typename: 'WordToWordTranslationWithVote',
            word_to_word_translation_id:
              newVoteStatus.word_to_word_translation_id,
          }),
          fragment: WordToWordTranslationWithVoteFragmentFragmentDoc,
          fragmentName: 'WordToWordTranslationWithVoteFragment',
        },
        (data) => {
          if (data) {
            return {
              ...data,
              upvotes: newVoteStatus.upvotes,
              downvotes: newVoteStatus.downvotes,
            };
          } else {
            return data;
          }
        },
      );
      break;
    }
    case 'WordToPhraseTranslationVoteStatus': {
      cache.updateFragment<WordToPhraseTranslationWithVote>(
        {
          id: cache.identify({
            __typename: 'WordToPhraseTranslationWithVote',
            word_to_phrase_translation_id:
              newVoteStatus.word_to_phrase_translation_id,
          }),
          fragment: WordToPhraseTranslationWithVoteFragmentFragmentDoc,
          fragmentName: 'WordToPhraseTranslationWithVoteFragment',
        },
        (data) => {
          if (data) {
            return {
              ...data,
              upvotes: newVoteStatus.upvotes,
              downvotes: newVoteStatus.downvotes,
            };
          } else {
            return data;
          }
        },
      );
      break;
    }
    case 'PhraseToWordTranslationVoteStatus': {
      cache.updateFragment<PhraseToWordTranslationWithVote>(
        {
          id: cache.identify({
            __typename: 'PhraseToWordTranslationWithVote',
            phrase_to_word_translation_id:
              newVoteStatus.phrase_to_word_translation_id,
          }),
          fragment: PhraseToWordTranslationWithVoteFragmentFragmentDoc,
          fragmentName: 'PhraseToWordTranslationWithVoteFragment',
        },
        (data) => {
          if (data) {
            return {
              ...data,
              upvotes: newVoteStatus.upvotes,
              downvotes: newVoteStatus.downvotes,
            };
          } else {
            return data;
          }
        },
      );
      break;
    }
    case 'PhraseToPhraseTranslationVoteStatus': {
      cache.updateFragment<PhraseToPhraseTranslationWithVote>(
        {
          id: cache.identify({
            __typename: 'PhraseToPhraseTranslationWithVote',
            phrase_to_phrase_translation_id:
              newVoteStatus.phrase_to_phrase_translation_id,
          }),
          fragment: PhraseToPhraseTranslationWithVoteFragmentFragmentDoc,
          fragmentName: 'PhraseToPhraseTranslationWithVoteFragment',
        },
        (data) => {
          if (data) {
            return {
              ...data,
              upvotes: newVoteStatus.upvotes,
              downvotes: newVoteStatus.downvotes,
            };
          } else {
            return data;
          }
        },
      );
      break;
    }
  }
}
