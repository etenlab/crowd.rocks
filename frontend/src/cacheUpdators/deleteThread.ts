import { ApolloCache } from '@apollo/client';

import {
  GetThreadsListDocument,
  GetThreadsListQuery,
} from '../generated/graphql';
import { GetThreadsListVariable } from '../reducers/non-persistent.reducer';

export function updateCacheWithDeleteThread(
  cache: ApolloCache<unknown>,
  deletedThreadId: string,
  variablesList: GetThreadsListVariable[],
) {
  for (const variables of variablesList) {
    cache.updateQuery<GetThreadsListQuery>(
      {
        query: GetThreadsListDocument,
        variables,
      },
      (data) => {
        if (data) {
          const exists = data.getThreadsList.edges.filter(
            (edge) => edge.node.thread_id === deletedThreadId,
          );

          if (exists.length === 0) {
            return data;
          }

          return {
            ...data,
            getThreadsList: {
              ...data.getThreadsList,
              edges: [
                ...data.getThreadsList.edges.filter(
                  (edge) => edge.node.thread_id !== deletedThreadId,
                ),
              ],
              pageInfo: {
                ...data.getThreadsList.pageInfo,
                totalEdges: data.getThreadsList.pageInfo.totalEdges
                  ? data.getThreadsList.pageInfo.totalEdges - 1
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
