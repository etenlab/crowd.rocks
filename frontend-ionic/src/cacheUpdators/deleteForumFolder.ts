import { ApolloCache } from '@apollo/client';

import {
  ForumFolderNode,
  ForumFolderNodeFragmentFragmentDoc,
  GetForumFoldersListDocument,
  GetForumFoldersListQuery,
} from '../generated/graphql';
import { GetForumFoldersListVariable } from '../reducers/non-persistent.reducer';
import { updateForumsListCache } from './upsertForum';

export function updateCacheWithDeleteForumFolder(
  cache: ApolloCache<unknown>,
  deletedForumFolderId: string,
  variablesList: GetForumFoldersListVariable[],
) {
  const data = cache.readFragment<ForumFolderNode>({
    id: cache.identify({
      __typename: 'ForumFolderNode',
      forum_folder_id: deletedForumFolderId,
    }),
    fragment: ForumFolderNodeFragmentFragmentDoc,
    fragmentName: 'ForumFolderNodeFragment',
  });

  if (!data) {
    return;
  }

  updateForumsListCache(cache, data.forum_id, {
    total_posts: -data.total_posts,
    total_threads: -data.total_threads,
    total_topics: -1,
  });

  for (const variables of variablesList) {
    cache.updateQuery<GetForumFoldersListQuery>(
      {
        query: GetForumFoldersListDocument,
        variables,
      },
      (data) => {
        if (data) {
          const exists = data.getForumFoldersList.edges.filter(
            (edge) => edge.node.forum_folder_id === deletedForumFolderId,
          );

          if (exists.length === 0) {
            return data;
          }

          return {
            ...data,
            getForumFoldersList: {
              ...data.getForumFoldersList,
              edges: [
                ...data.getForumFoldersList.edges.filter(
                  (edge) => edge.node.forum_folder_id !== deletedForumFolderId,
                ),
              ],
              pageInfo: {
                ...data.getForumFoldersList.pageInfo,
                totalEdges: data.getForumFoldersList.pageInfo.totalEdges
                  ? data.getForumFoldersList.pageInfo.totalEdges - 1
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
