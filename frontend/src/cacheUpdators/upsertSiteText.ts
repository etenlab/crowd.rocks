import { ApolloCache } from '@apollo/client';

import { GetAllSiteTextDefinitionsVariable } from '../reducers/non-persistent.reducer';
import {
  SiteTextDefinition,
  GetAllSiteTextDefinitionsQuery,
  SiteTextDefinitionEdge,
} from '../generated/graphql';
import { GetAllSiteTextDefinitionsDocument } from '../generated/graphql';

export function updateCacheWithUpsertSiteText(
  cache: ApolloCache<unknown>,
  variablesList: GetAllSiteTextDefinitionsVariable[],
  newSiteTextDefinition: SiteTextDefinition,
) {
  for (const variables of variablesList) {
    cache.updateQuery<GetAllSiteTextDefinitionsQuery>(
      {
        query: GetAllSiteTextDefinitionsDocument,
        variables,
      },
      (data) => {
        if (data && data.getAllSiteTextDefinitions.edges) {
          const alreadyExists = data.getAllSiteTextDefinitions.edges.filter(
            (edge) =>
              edge.node.__typename === newSiteTextDefinition.__typename &&
              edge.node.site_text_id === newSiteTextDefinition.site_text_id,
          );

          if (alreadyExists.length > 0) {
            return data;
          }

          let edges: SiteTextDefinitionEdge[] = [];

          if (newSiteTextDefinition.__typename === 'SiteTextWordDefinition') {
            edges = [
              {
                __typename: 'SiteTextDefinitionEdge',
                cursor: newSiteTextDefinition.word_definition.word.word,
                node: newSiteTextDefinition,
              },
              ...data.getAllSiteTextDefinitions.edges,
            ];
          } else if (
            newSiteTextDefinition.__typename === 'SiteTextPhraseDefinition'
          ) {
            edges = [
              {
                __typename: 'SiteTextDefinitionEdge',
                cursor: newSiteTextDefinition.phrase_definition.phrase.phrase,
                node: newSiteTextDefinition,
              },
              ...data.getAllSiteTextDefinitions.edges,
            ];
          }

          return {
            ...data,
            getAllSiteTextDefinitions: {
              ...data.getAllSiteTextDefinitions,
              edges: edges.sort((edge1, edge2) => {
                let a =
                  edge1.node.__typename === 'SiteTextWordDefinition'
                    ? edge1.node.word_definition.word.word
                    : '';
                a =
                  edge1.node.__typename === 'SiteTextPhraseDefinition'
                    ? edge1.node.phrase_definition.phrase.phrase
                    : '';
                let b =
                  edge2.node.__typename === 'SiteTextWordDefinition'
                    ? edge2.node.word_definition.word.word
                    : '';
                b =
                  edge2.node.__typename === 'SiteTextPhraseDefinition'
                    ? edge2.node.phrase_definition.phrase.phrase
                    : '';
                if (a.toLowerCase() < b.toLowerCase()) {
                  return -1;
                } else if (a.toLowerCase() > b.toLowerCase()) {
                  return 1;
                } else {
                  return 0;
                }
              }),
            },
          };
        } else {
          return data;
        }
      },
    );
  }
}
