import { ApolloCache } from '@apollo/client';

import {
  WordDefinition,
  WordWithDefinitions,
  GetWordDefinitionsByWordIdQuery,
} from '../generated/graphql';
import {
  GetWordDefinitionsByWordIdDocument,
  WordWithDefinitionsFragmentFragmentDoc,
} from '../generated/graphql';

export function updateCacheWithUpsertWordDefinition(
  cache: ApolloCache<unknown>,
  newWordDefinition: WordDefinition,
) {
  cache.updateQuery<GetWordDefinitionsByWordIdQuery>(
    {
      query: GetWordDefinitionsByWordIdDocument,
      variables: {
        word_id: newWordDefinition.word.word_id,
      },
    },
    (data) => {
      if (data) {
        const alreadyExists =
          data.getWordDefinitionsByWordId.word_definition_list.filter(
            (wordDefinition) =>
              wordDefinition?.word_definition_id ===
              newWordDefinition.word_definition_id,
          );

        if (alreadyExists.length > 0) {
          return data;
        }

        return {
          ...data,
          getWordDefinitionsByWordId: {
            ...data.getWordDefinitionsByWordId,
            word_definition_list: [
              ...data.getWordDefinitionsByWordId.word_definition_list,
              {
                ...newWordDefinition,
                __typename: 'WordDefinitionWithVote',
                upvotes: 0,
                downvotes: 0,
                created_at: new Date().toISOString(),
              },
            ],
          },
        };
      } else {
        return data;
      }
    },
  );

  cache.updateFragment<WordWithDefinitions>(
    {
      id: cache.identify({
        __typename: 'WordWithDefinitions',
        word_id: newWordDefinition.word.word_id,
      }),
      fragment: WordWithDefinitionsFragmentFragmentDoc,
      fragmentName: 'WordWithDefinitionsFragment',
    },
    (data) => {
      if (data) {
        return {
          ...data,
          definitions: [
            ...data.definitions.filter(
              (definition) =>
                definition?.word_definition_id !==
                newWordDefinition.word_definition_id,
            ),
            newWordDefinition,
          ],
        };
      } else {
        return data;
      }
    },
  );
}
