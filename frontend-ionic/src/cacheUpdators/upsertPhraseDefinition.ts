import { ApolloCache } from '@apollo/client';

import {
  PhraseDefinition,
  PhraseWithDefinitions,
  GetPhraseDefinitionsByPhraseIdQuery,
} from '../generated/graphql';
import {
  GetPhraseDefinitionsByPhraseIdDocument,
  PhraseWithDefinitionsFragmentFragmentDoc,
} from '../generated/graphql';

export function updateCacheWithUpsertPhraseDefinition(
  cache: ApolloCache<unknown>,
  newDefinition: PhraseDefinition,
) {
  cache.updateQuery<GetPhraseDefinitionsByPhraseIdQuery>(
    {
      query: GetPhraseDefinitionsByPhraseIdDocument,
      variables: {
        phrase_id: newDefinition.phrase.phrase_id,
      },
    },
    (data) => {
      if (data) {
        const alreadyExists =
          data.getPhraseDefinitionsByPhraseId.phrase_definition_list.filter(
            (phraseDefinition) =>
              phraseDefinition?.phrase_definition_id ===
              newDefinition.phrase_definition_id,
          );

        if (alreadyExists.length > 0) {
          return data;
        }

        return {
          ...data,
          getPhraseDefinitionsByPhraseId: {
            ...data.getPhraseDefinitionsByPhraseId,
            phrase_definition_list: [
              ...data.getPhraseDefinitionsByPhraseId.phrase_definition_list,
              {
                ...newDefinition,
                __typename: 'PhraseDefinitionWithVote',
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

  cache.updateFragment<PhraseWithDefinitions>(
    {
      id: cache.identify({
        __typename: 'PhraseWithDefinitions',
        phrase_id: newDefinition.phrase.phrase_id,
      }),
      fragment: PhraseWithDefinitionsFragmentFragmentDoc,
      fragmentName: 'PhraseWithDefinitionsFragment',
    },
    (data) => {
      if (data) {
        return {
          ...data,
          definitions: [
            ...data.definitions.filter(
              (definition) =>
                definition?.phrase_definition_id !==
                newDefinition.phrase_definition_id,
            ),
            newDefinition,
          ],
        };
      } else {
        return data;
      }
    },
  );
}
