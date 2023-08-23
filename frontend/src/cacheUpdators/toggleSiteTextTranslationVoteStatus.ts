import { ApolloCache } from '@apollo/client';

import {
  SiteTextTranslationVoteStatus,
  SiteTextWordToWordTranslationWithVote,
  SiteTextWordToPhraseTranslationWithVote,
  SiteTextPhraseToWordTranslationWithVote,
  SiteTextPhraseToPhraseTranslationWithVote,
} from '../generated/graphql';
import {
  SiteTextWordToWordTranslationWithVoteFragmentFragmentDoc,
  SiteTextWordToPhraseTranslationWithVoteFragmentFragmentDoc,
  SiteTextPhraseToWordTranslationWithVoteFragmentFragmentDoc,
  SiteTextPhraseToPhraseTranslationWithVoteFragmentFragmentDoc,
} from '../generated/graphql';

export function updateCacheWithToggleSiteTextTranslationVoteStatus(
  cache: ApolloCache<unknown>,
  newVoteStatus: SiteTextTranslationVoteStatus,
) {
  const {
    translation_id,
    from_type_is_word,
    to_type_is_word,
    upvotes,
    downvotes,
  } = newVoteStatus;

  if (from_type_is_word === true && to_type_is_word === true) {
    cache.updateFragment<SiteTextWordToWordTranslationWithVote>(
      {
        id: cache.identify({
          __typename: 'SiteTextWordToWordTranslationWithVote',
          word_to_word_translation_id: translation_id,
        }),
        fragment: SiteTextWordToWordTranslationWithVoteFragmentFragmentDoc,
        fragmentName: 'SiteTextWordToWordTranslationWithVoteFragment',
      },
      (data) => {
        if (data) {
          return {
            ...data,
            upvotes: upvotes,
            downvotes: downvotes,
          };
        } else {
          return data;
        }
      },
    );
  }

  if (from_type_is_word === true && to_type_is_word === false) {
    cache.updateFragment<SiteTextWordToPhraseTranslationWithVote>(
      {
        id: cache.identify({
          __typename: 'SiteTextWordToPhraseTranslationWithVote',
          word_to_phrase_translation_id: translation_id,
        }),
        fragment: SiteTextWordToPhraseTranslationWithVoteFragmentFragmentDoc,
        fragmentName: 'SiteTextWordToPhraseTranslationWithVoteFragment',
      },
      (data) => {
        if (data) {
          return {
            ...data,
            upvotes: upvotes,
            downvotes: downvotes,
          };
        } else {
          return data;
        }
      },
    );
  }

  if (from_type_is_word === false && to_type_is_word === true) {
    cache.updateFragment<SiteTextPhraseToWordTranslationWithVote>(
      {
        id: cache.identify({
          __typename: 'SiteTextPhraseToWordTranslationWithVote',
          phrase_to_word_translation_id: translation_id,
        }),
        fragment: SiteTextPhraseToWordTranslationWithVoteFragmentFragmentDoc,
        fragmentName: 'SiteTextPhraseToWordTranslationWithVoteFragment',
      },
      (data) => {
        if (data) {
          return {
            ...data,
            upvotes: upvotes,
            downvotes: downvotes,
          };
        } else {
          return data;
        }
      },
    );
  }

  if (from_type_is_word === false && to_type_is_word === false) {
    cache.updateFragment<SiteTextPhraseToPhraseTranslationWithVote>(
      {
        id: cache.identify({
          __typename: 'SiteTextPhraseToPhraseTranslationWithVote',
          phrase_to_phrase_translation_id: translation_id,
        }),
        fragment: SiteTextPhraseToPhraseTranslationWithVoteFragmentFragmentDoc,
        fragmentName: 'SiteTextPhraseToPhraseTranslationWithVoteFragment',
      },
      (data) => {
        if (data) {
          return {
            ...data,
            upvotes: upvotes,
            downvotes: downvotes,
          };
        } else {
          return data;
        }
      },
    );
  }
}
