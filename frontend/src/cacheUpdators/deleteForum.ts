import { ApolloCache } from '@apollo/client';

import {
  GetForumsListDocument,
  GetForumsListQuery,
} from '../generated/graphql';
import { GetForumsListVariable } from '../reducers/non-persistent.reducer';

export function updateCacheWithDeleteForum(
  cache: ApolloCache<unknown>,
  deletedForumId: string,
  variablesList: GetForumsListVariable[],
) {
  for (const variables of variablesList) {
    cache.updateQuery<GetForumsListQuery>(
      {
        query: GetForumsListDocument,
        variables,
      },
      (data) => {
        if (data) {
          const exists = data.getForumsList.edges.filter(
            (edge) => edge.node.forum_id === deletedForumId,
          );

          if (exists.length === 0) {
            return data;
          }

          return {
            ...data,
            getForumsList: {
              ...data.getForumsList,
              edges: [
                ...data.getForumsList.edges.filter(
                  (edge) => edge.node.forum_id !== deletedForumId,
                ),
              ],
              pageInfo: {
                ...data.getForumsList.pageInfo,
                totalEdges: data.getForumsList.pageInfo.totalEdges
                  ? data.getForumsList.pageInfo.totalEdges - 1
                  : 0,
              },
            },
          };
        } else {
          return data;
        }
      },
    );
  }
}
