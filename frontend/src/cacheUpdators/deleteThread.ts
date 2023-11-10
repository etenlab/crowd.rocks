import { ApolloCache } from '@apollo/client';

import {
  Thread,
  GetThreadsListDocument,
  GetThreadsListQuery,
  ThreadFragmentFragmentDoc,
  GetTotalPostsQuery,
  GetTotalPostsDocument,
  TableNameType,
} from '../generated/graphql';
import { GetThreadsListVariable } from '../reducers/non-persistent.reducer';
import { updateForumFoldersListCache } from './upsertForumFolder';

export function updateCacheWithDeleteThread(
  cache: ApolloCache<unknown>,
  deletedThreadId: string,
  variablesList: GetThreadsListVariable[],
) {
  const threadData = cache.readFragment<Thread>({
    id: cache.identify({
      __typename: 'Thread',
      thread_id: deletedThreadId,
    }),
    fragment: ThreadFragmentFragmentDoc,
    fragmentName: 'ThreadFragment',
  });

  if (threadData) {
    updateForumFoldersListCache(cache, threadData.forum_folder_id, {
      total_posts: 0,
      total_threads: -1,
    });

    const postData = cache.readQuery<GetTotalPostsQuery>({
      query: GetTotalPostsDocument,
      variables: {
        parent_id: deletedThreadId,
        parent_name: TableNameType.Threads,
      },
    });

    if (postData?.getTotalPosts) {
      updateForumFoldersListCache(cache, threadData.forum_folder_id, {
        total_posts: -postData?.getTotalPosts.total || 0,
        total_threads: 0,
      });
    }
  }

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
