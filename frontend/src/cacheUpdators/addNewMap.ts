import { ApolloCache } from '@apollo/client';

import {
  ErrorType,
  GetAllMapsListDocument,
  GetAllMapsListQuery,
  MapDetailsInfo,
} from '../generated/graphql';

export function updateCacheWithAddNewMap(
  cache: ApolloCache<unknown>,
  newMap: MapDetailsInfo,
) {
  cache.updateQuery<GetAllMapsListQuery>(
    {
      query: GetAllMapsListDocument,
    },
    (data) => {
      if (data) {
        data.getAllMapsList.edges.push({
          cursor: 'some-cursor',
          node: {
            mapDetails: newMap,
            error: ErrorType.NoError,
          },
        });
      }
      return data;
    },
  );
}
