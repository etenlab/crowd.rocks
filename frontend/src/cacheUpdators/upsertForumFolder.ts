import { ApolloCache } from '@apollo/client';

import {
  ForumFolderEdge,
  ForumFolder,
  GetForumFoldersListDocument,
  GetForumFoldersListQuery,
} from '../generated/graphql';
import { GetForumFoldersListVariable } from '../reducers/non-persistent.reducer';

export function updateCacheWithUpdateForumFolder(
  cache: ApolloCache<unknown>,
  updatedForumFolder: ForumFolder,
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
          return {
            ...data,
            getForumFoldersList: {
              ...data.getForumFoldersList,
              edges: [
                ...data.getForumFoldersList.edges.map((edge) => {
                  if (
                    edge.node.forum_folder_id !==
                    updatedForumFolder.forum_folder_id
                  ) {
                    return edge;
                  }

                  return {
                    ...edge,
                    cursor: updatedForumFolder.name,
                    node: updatedForumFolder,
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

export function updateCacheWithCreateForumFolder(
  cache: ApolloCache<unknown>,
  newForumFolder: ForumFolder,
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
          const alreadyExists = data.getForumFoldersList.edges.filter(
            (edge) =>
              edge.node.forum_folder_id === newForumFolder.forum_folder_id,
          );

          if (alreadyExists.length > 0) {
            return data;
          }

          const edges: ForumFolderEdge[] = [
            ...data.getForumFoldersList.edges,
            {
              __typename: 'ForumFolderEdge',
              cursor: newForumFolder.name,
              node: newForumFolder,
            } as ForumFolderEdge,
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
            getForumFoldersList: {
              ...data.getForumFoldersList,
              edges: [...edges],
              pageInfo: {
                ...data.getForumFoldersList.pageInfo,
                totalEdges:
                  (data.getForumFoldersList.pageInfo.totalEdges || 0) + 1,
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
