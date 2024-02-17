import { ApolloCache } from '@apollo/client';

import {
  Thread,
  GetThreadsListDocument,
  GetThreadsListQuery,
  ThreadEdge,
  ThreadFragmentFragmentDoc,
} from '../generated/graphql';
import { GetThreadsListVariable } from '../reducers/non-persistent.reducer';

import { updateForumFoldersListCache } from './upsertForumFolder';

export function updateCacheWithUpdateThread(
  cache: ApolloCache<unknown>,
  updatedThread: Thread,
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
          return {
            ...data,
            getThreadsList: {
              ...data.getThreadsList,
              edges: [
                ...data.getThreadsList.edges.map((edge) => {
                  if (edge.node.thread_id !== updatedThread.thread_id) {
                    return edge;
                  }

                  return {
                    ...edge,
                    cursor: updatedThread.name,
                    node: updatedThread,
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

export function updateThreadsListCache(
  cache: ApolloCache<unknown>,
  thread_id: string,
  gap: {
    total_posts: number;
  },
) {
  const data = cache.readFragment<Thread>({
    id: cache.identify({
      __typename: 'Thread',
      thread_id: thread_id,
    }),
    fragment: ThreadFragmentFragmentDoc,
    fragmentName: 'ThreadFragment',
  });

  if (!data) {
    return;
  }

  updateForumFoldersListCache(cache, data.forum_folder_id, {
    total_posts: gap.total_posts,
    total_threads: 0,
  });
}

export function updateCacheWithCreateThread(
  cache: ApolloCache<unknown>,
  newThread: Thread,
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
          const alreadyExists = data.getThreadsList.edges.filter(
            (edge) => edge.node.thread_id === newThread.thread_id,
          );

          if (alreadyExists.length > 0) {
            return data;
          }

          const edges: ThreadEdge[] = [
            ...data.getThreadsList.edges,
            {
              __typename: 'ThreadEdge',
              cursor: newThread.name,
              node: newThread,
            } as ThreadEdge,
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
            getThreadsList: {
              ...data.getThreadsList,
              edges: [...edges],
              pageInfo: {
                ...data.getThreadsList.pageInfo,
                totalEdges: (data.getThreadsList.pageInfo.totalEdges || 0) + 1,
              },
            },
          };
        } else {
          return data;
        }
      },
    );
  }

  updateForumFoldersListCache(cache, newThread.forum_folder_id, {
    total_posts: 0,
    total_threads: 1,
  });
}
