import { ApolloCache } from '@apollo/client';

import {
  Forum,
  ForumEdge,
  ForumNode,
  ForumNodeFragmentFragmentDoc,
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
                    node: {
                      ...edge.node,
                      name: updatedForum.name,
                      description: updatedForum.description,
                    },
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

export function updateForumsListCache(
  cache: ApolloCache<unknown>,
  forum_id: string,
  gap: {
    total_posts: number;
    total_threads: number;
    total_topics: number;
  },
) {
  const data = cache.readFragment<ForumNode>({
    id: cache.identify({
      __typename: 'ForumNode',
      forum_id: forum_id,
    }),
    fragment: ForumNodeFragmentFragmentDoc,
    fragmentName: 'ForumNodeFragment',
  });

  if (!data) {
    return;
  }

  cache.writeFragment<ForumNode>({
    id: cache.identify({
      __typename: 'ForumNode',
      forum_id: forum_id,
    }),
    fragment: ForumNodeFragmentFragmentDoc,
    fragmentName: 'ForumNodeFragment',
    data: {
      ...data,
      total_posts: data.total_posts + gap.total_posts,
      total_threads: data.total_threads + gap.total_threads,
      total_topics: data.total_topics + gap.total_topics,
    },
  });
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
              node: {
                ...newForum,
                __typename: 'ForumNode',
                total_posts: 0,
                total_threads: 0,
                total_topics: 0,
              },
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
