import { ApolloCache } from '@apollo/client';

import {
  GetForumFoldersListDocument,
  GetForumFoldersListQuery,
} from '../generated/graphql';
import { GetForumFoldersListVariable } from '../reducers/non-persistent.reducer';

export function updateCacheWithDeleteForumFolder(
  cache: ApolloCache<unknown>,
  deletedForumFolderId: string,
  variablesList: GetForumFoldersListVariable[],
) {
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
