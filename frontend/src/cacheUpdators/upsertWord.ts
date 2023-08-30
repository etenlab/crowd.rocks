import { ApolloCache } from '@apollo/client';

import {
  Word,
  WordWithVoteListEdge,
  WordWithDefinitions,
  GetWordsByLanguageQuery,
} from '../generated/graphql';
import {
  WordWithVoteListEdgeFragmentFragmentDoc,
  GetWordsByLanguageDocument,
} from '../generated/graphql';

export function updateCacheWithUpsertWord(
  cache: ApolloCache<unknown>,
  newWord: Word,
) {
  cache.writeFragment<WordWithVoteListEdge>({
    id: cache.identify({
      __typename: 'WordWithVoteListEdge',
      cursor: newWord.word_id,
    }),
    fragment: WordWithVoteListEdgeFragmentFragmentDoc,
    fragmentName: 'WordWithVoteListEdgeFragment',
    data: {
      __typename: 'WordWithVoteListEdge',
      cursor: newWord.word_id,
      node: {
        ...newWord,
        __typename: 'WordWithDefinitions',
        definitions: [],
        upvotes: 0,
        downvotes: 0,
        created_at: new Date().toISOString(),
      } as WordWithDefinitions,
    },
  });

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
        const alreadyExists = data.getWordsByLanguage.edges.filter((edge) => {
          return edge.node.word_id === newWord.word_id;
        });

        if (alreadyExists.length > 0) {
          return data;
        }

        return {
          ...data,
          getWordsByLanguage: {
            ...data.getWordsByLanguage,
            edges: [
              ...data.getWordsByLanguage.edges,
              {
                __typename: 'WordWithVoteListEdge',
                cursor: newWord.word_id,
                node: {
                  ...newWord,
                  __typename: 'WordWithDefinitions',
                  definitions: [],
                  upvotes: 0,
                  downvotes: 0,
                  created_at: new Date().toISOString(),
                } as WordWithDefinitions,
              } as WordWithVoteListEdge,
            ],
            pageInfo: {
              ...data.getWordsByLanguage.pageInfo,
            },
          },
        };
      } else {
        return data;
      }
    },
  );
}
