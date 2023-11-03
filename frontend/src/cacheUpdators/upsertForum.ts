import { ApolloCache } from '@apollo/client';

import {
  Forum,
  ForumEdge,
  GetForumsListDocument,
  GetForumsListQuery,
} from '../generated/graphql';
import { GetForumsListVariable } from '../reducers/non-persistent.reducer';

export function updateCacheWithUpdateForum(
  cache: ApolloCache<unknown>,
  updatedForum: Forum,
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
          return {
            ...data,
            getForumsList: {
              ...data.getForumsList,
              edges: [
                ...data.getForumsList.edges.map((edge) => {
                  if (edge.node.forum_id !== updatedForum.forum_id) {
                    return edge;
                  }

                  return {
                    ...edge,
                    cursor: updatedForum.name,
                    node: updatedForum,
                  };
                }),
              ],
            },
          };
        } else {
          return data;
        }
      },
    );
  }
}

export function updateCacheWithCreateForum(
  cache: ApolloCache<unknown>,
  newForum: Forum,
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
          const alreadyExists = data.getForumsList.edges.filter(
            (edge) => edge.node.forum_id === newForum.forum_id,
          );

          if (alreadyExists.length > 0) {
            return data;
          }

          const edges: ForumEdge[] = [
            ...data.getForumsList.edges,
            {
              __typename: 'ForumEdge',
              cursor: newForum.name,
              node: newForum,
            } as ForumEdge,
          ].sort((a, b) => {
            if (a.cursor.toLowerCase() < b.cursor.toLowerCase()) {
              return -1;
            } else if (a.cursor.toLowerCase() > b.cursor.toLowerCase()) {
              return 1;
            } else {
              return 0;
            }
          });

          return {
            ...data,
            getForumsList: {
              ...data.getForumsList,
              edges: [...edges],
              pageInfo: {
                ...data.getForumsList.pageInfo,
                totalEdges: (data.getForumsList.pageInfo.totalEdges || 0) + 1,
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
