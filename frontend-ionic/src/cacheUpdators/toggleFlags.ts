import { ApolloCache } from '@apollo/client';

import { Flag, TableNameType } from '../generated/graphql';
import {
  GetFlagsFromRefDocument,
  GetFlagsFromRefQuery,
} from '../generated/graphql';

export function updateCacheWithToggleFlags(
  cache: ApolloCache<unknown>,
  newToggle: Flag[],
  parent_table: TableNameType,
  parent_id: string,
) {
  cache.updateQuery<GetFlagsFromRefQuery>(
    {
      query: GetFlagsFromRefDocument,
      variables: {
        parent_table,
        parent_id,
      },
    },
    (data) => {
      if (data) {
        return {
          ...data,
          getFlagsFromRef: {
            ...data.getFlagsFromRef,
            flags: newToggle,
          },
        };
      } else {
        return data;
      }
    },
  );
}
