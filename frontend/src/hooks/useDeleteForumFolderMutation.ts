import { useIonToast } from '@ionic/react';

import { useDeleteForumFolderMutation as useGeneratedDeleteForumFolderMutation } from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { useTr } from './useTr';
import { useAppContext } from './useAppContext';

import { updateCacheWithDeleteForumFolder } from '../cacheUpdators/deleteForumFolder';
import { useUnauthorizedRedirect } from './useUnauthorizedRedirect';

export function useDeleteForumFolderMutation(forum_id: string) {
  const { tr } = useTr();
  const {
    states: {
      nonPersistent: {
        paginationVariables: { getForumFoldersLists },
      },
    },
  } = useAppContext();
  const [present] = useIonToast();
  const redirectOnUnauth = useUnauthorizedRedirect();

  return useGeneratedDeleteForumFolderMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.forumFolderDelete.forum_folder_id &&
        data.forumFolderDelete.error === ErrorType.NoError
      ) {
        const deletedForumFolderId = data.forumFolderDelete.forum_folder_id;

        const variablesList = Object.values(getForumFoldersLists).filter(
          (variables) => variables.forum_id === forum_id,
        );

        updateCacheWithDeleteForumFolder(
          cache,
          deletedForumFolderId,
          variablesList,
        );

        present({
          message: tr('Success at deleting forum topic!'),
          duration: 1500,
          position: 'top',
          color: 'success',
        });
      } else {
        console.log('useDeleteForumFolderMutation: ', errors);
        console.log(data?.forumFolderDelete.error);

        present({
          message: `${tr('Failed at updating forum folder!')} [${data
            ?.forumFolderDelete.error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        redirectOnUnauth(data?.forumFolderDelete.error);
      }
    },
  });
}
