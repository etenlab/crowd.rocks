import { ApolloCache } from '@apollo/client';

import {
  Phrase,
  PhraseWithVoteListEdge,
  PhraseWithDefinitions,
  GetPhrasesByLanguageQuery,
} from '../generated/graphql';
import {
  GetPhrasesByLanguageDocument,
  PhraseWithVoteListEdgeFragmentFragmentDoc,
} from '../generated/graphql';

export function updateCacheWithUpsertPhrase(
  cache: ApolloCache<unknown>,
  newPhrase: Phrase,
) {
  cache.writeFragment<PhraseWithVoteListEdge>({
    id: cache.identify({
      __typename: 'PhraseWithVoteListEdge',
      cursor: newPhrase.phrase_id,
    }),
    fragment: PhraseWithVoteListEdgeFragmentFragmentDoc,
    fragmentName: 'PhraseWithVoteListEdgeFragment',
    data: {
      __typename: 'PhraseWithVoteListEdge',
      cursor: newPhrase.phrase_id,
      node: {
        ...newPhrase,
        __typename: 'PhraseWithDefinitions',
        definitions: [],
        upvotes: 0,
        downvotes: 0,
        created_at: new Date().toISOString(),
      } as PhraseWithDefinitions,
    },
  });

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
        const alreadyExists = data.getPhrasesByLanguage.edges.filter((edge) => {
          return edge.node.phrase_id === newPhrase.phrase_id;
        });

        if (alreadyExists.length > 0) {
          return data;
        }

        return {
          ...data,
          getPhrasesByLanguage: {
            ...data.getPhrasesByLanguage,
            edges: [
              ...data.getPhrasesByLanguage.edges,
              {
                __typename: 'PhraseWithVoteListEdge',
                cursor: newPhrase.phrase_id,
                node: {
                  ...newPhrase,
                  __typename: 'PhraseWithDefinitions',
                  definitions: [],
                  upvotes: 0,
                  downvotes: 0,
                  created_at: new Date().toISOString(),
                } as PhraseWithDefinitions,
              } as PhraseWithVoteListEdge,
            ],
            pageInfo: {
              ...data.getPhrasesByLanguage.pageInfo,
            },
          },
        };
      } else {
        return data;
      }
    },
  );
}
