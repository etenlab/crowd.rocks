import { ApolloCache } from '@apollo/client';

import {
  ForumFolder,
  GetForumFoldersDocument,
  GetForumFoldersQuery,
} from '../generated/graphql';

export function updateCacheWithUpsertForumFolder(
  cache: ApolloCache<unknown>,
  newForumFolder: ForumFolder,
  forum_id: string,
) {
  cache.updateQuery<GetForumFoldersQuery>(
    {
      query: GetForumFoldersDocument,
      variables: {
        forum_id: forum_id,
      },
    },
    (data) => {
      if (data) {
        const alreadyExists = data.forumFolders.folders.filter(
          (folder) => folder?.folder_id === newForumFolder.folder_id,
        );

        if (alreadyExists.length > 0) {
          return data;
        }

        return {
          ...data,
          forumFolders: {
            ...data.forumFolders,
            folders: [
              ...data.forumFolders.folders,
              {
                ...newForumFolder,
                __typename: 'ForumFolder',
                created_at: new Date().toISOString(),
              },
            ],
          },
        };
      } else {
        return data;
      }
    },
  );
}
