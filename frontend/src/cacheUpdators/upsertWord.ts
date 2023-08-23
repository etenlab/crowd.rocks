import { ApolloCache } from '@apollo/client';

import {
  Word,
  WordWithDefinitions,
  GetWordsByLanguageQuery,
} from '../generated/graphql';
import { GetWordsByLanguageDocument } from '../generated/graphql';

export function updateCacheWithUpsertWord(
  cache: ApolloCache<unknown>,
  newWord: Word,
) {
  cache.updateQuery<GetWordsByLanguageQuery>(
    {
      query: GetWordsByLanguageDocument,
      variables: {
        language_code: newWord.language_code,
        dialect_code: newWord.dialect_code,
        geo_code: newWord.geo_code,
        filter: '',
      },
    },
    (data) => {
      if (data) {
        const alreadyExists =
          data.getWordsByLanguage.word_with_vote_list.filter((wordWithVote) => {
            return wordWithVote?.word_id === newWord.word_id;
          });

        if (alreadyExists.length > 0) {
          return data;
        }

        return {
          ...data,
          getWordsByLanguage: {
            ...data.getWordsByLanguage,
            word_with_vote_list: [
              ...data.getWordsByLanguage.word_with_vote_list,
              {
                ...newWord,
                __typename: 'WordWithDefinitions',
                definitions: [],
                upvotes: 0,
                downvotes: 0,
                created_at: new Date().toISOString(),
              } as WordWithDefinitions,
            ],
          },
        };
      } else {
        return data;
      }
    },
  );
}
