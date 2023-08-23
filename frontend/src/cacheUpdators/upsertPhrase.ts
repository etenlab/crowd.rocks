import { ApolloCache } from '@apollo/client';

import {
  Phrase,
  PhraseWithDefinitions,
  GetPhrasesByLanguageQuery,
} from '../generated/graphql';
import { GetPhrasesByLanguageDocument } from '../generated/graphql';

export function updateCacheWithUpsertPhrase(
  cache: ApolloCache<unknown>,
  newPhrase: Phrase,
) {
  cache.updateQuery<GetPhrasesByLanguageQuery>(
    {
      query: GetPhrasesByLanguageDocument,
      variables: {
        language_code: newPhrase.language_code,
        dialect_code: newPhrase.dialect_code,
        geo_code: newPhrase.geo_code,
        filter: '',
      },
    },
    (data) => {
      if (data) {
        const alreadyExists =
          data.getPhrasesByLanguage.phrase_with_vote_list.filter(
            (phraseWithVote) => {
              return phraseWithVote?.phrase_id === newPhrase.phrase_id;
            },
          );

        if (alreadyExists.length > 0) {
          return data;
        }

        return {
          ...data,
          getPhrasesByLanguage: {
            ...data.getPhrasesByLanguage,
            phrase_with_vote_list: [
              ...data.getPhrasesByLanguage.phrase_with_vote_list,
              {
                ...newPhrase,
                __typename: 'PhraseWithDefinitions',
                definitions: [],
                upvotes: 0,
                downvotes: 0,
                created_at: new Date().toISOString(),
              } as PhraseWithDefinitions,
            ],
          },
        };
      } else {
        return data;
      }
    },
  );
}
