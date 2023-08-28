import { ApolloCache } from '@apollo/client';

import {
  SiteTextDefinition,
  GetAllSiteTextDefinitionsQuery,
} from '../generated/graphql';
import { GetAllSiteTextDefinitionsDocument } from '../generated/graphql';

export function updateCacheWithUpsertSiteText(
  cache: ApolloCache<unknown>,
  newSiteTextDefinition: SiteTextDefinition,
) {
  cache.updateQuery<GetAllSiteTextDefinitionsQuery>(
    {
      query: GetAllSiteTextDefinitionsDocument,
      variables: {},
    },
    (data) => {
      if (data && data.getAllSiteTextDefinitions.site_text_definition_list) {
        const alreadyExists =
          data.getAllSiteTextDefinitions.site_text_definition_list.filter(
            (site_text_definition) =>
              site_text_definition.__typename ===
                newSiteTextDefinition.__typename &&
              site_text_definition.site_text_id ===
                newSiteTextDefinition.site_text_id,
          );

        if (alreadyExists.length > 0) {
          return data;
        }

        return {
          ...data,
          getAllSiteTextDefinitions: {
            ...data.getAllSiteTextDefinitions,
            site_text_definition_list: [
              ...data.getAllSiteTextDefinitions.site_text_definition_list,
              newSiteTextDefinition,
            ],
          },
        };
      } else {
        return data;
      }
    },
  );
}
