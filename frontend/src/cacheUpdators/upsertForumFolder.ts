import { ApolloCache } from '@apollo/client';

import {
  ForumFolderEdge,
  ForumFolderNode,
  ForumFolder,
  GetForumFoldersListDocument,
  GetForumFoldersListQuery,
  ForumFolderNodeFragmentFragmentDoc,
} from '../generated/graphql';
import { GetForumFoldersListVariable } from '../reducers/non-persistent.reducer';
import { updateForumsListCache } from './upsertForum';

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
                    node: {
                      ...edge.node,
                      name: updatedForumFolder.name,
                      description: updatedForumFolder.description,
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

export function updateForumFoldersListCache(
  cache: ApolloCache<unknown>,
  forum_folder_id: string,
  gap: {
    total_posts: number;
    total_threads: number;
  },
) {
  const data = cache.readFragment<ForumFolderNode>({
    id: cache.identify({
      __typename: 'ForumFolderNode',
      forum_folder_id: forum_folder_id,
    }),
    fragment: ForumFolderNodeFragmentFragmentDoc,
    fragmentName: 'ForumFolderNodeFragment',
  });

  if (!data) {
    return;
  }

  cache.writeFragment<ForumFolderNode>({
    id: cache.identify({
      __typename: 'ForumFolderNode',
      forum_folder_id: forum_folder_id,
    }),
    fragment: ForumFolderNodeFragmentFragmentDoc,
    fragmentName: 'ForumFolderNodeFragment',
    data: {
      ...data,
      total_posts: data.total_posts + gap.total_posts,
      total_threads: data.total_threads + gap.total_threads,
    },
  });

  updateForumsListCache(cache, data.forum_id, {
    total_posts: gap.total_posts,
    total_threads: gap.total_threads,
    total_topics: 0,
  });
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
              node: {
                ...newForumFolder,
                __typename: 'ForumFolderNode',
                total_posts: 0,
                total_threads: 0,
              },
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

  updateForumsListCache(cache, newForumFolder.forum_id, {
    total_posts: 0,
    total_threads: 0,
    total_topics: 1,
  });
}
