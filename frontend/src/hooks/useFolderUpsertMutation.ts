import { useIonToast } from '@ionic/react';

import { useCreateForumFolderMutation as useGeneratedForumFolderCreateMutation } from '../generated/graphql';
import { useUpdateForumFolderMutation as useGeneratedForumFolderUpdateMutation } from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { useTr } from './useTr';
import { useAppContext } from './useAppContext';

import {
  updateCacheWithCreateForumFolder,
  updateCacheWithUpdateForumFolder,
} from '../cacheUpdators/upsertForumFolder';
import { useUnauthorizedRedirect } from './useUnauthorizedRedirect';

export function useForumFolderUpdateMutation() {
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

  return useGeneratedForumFolderUpdateMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.forumFolderUpsert.folder &&
        data.forumFolderUpsert.error === ErrorType.NoError
      ) {
        const updatedForumFolder = data.forumFolderUpsert.folder;

        const variablesList = Object.values(getForumFoldersLists).filter(
          (variables) => variables.forum_id === updatedForumFolder.forum_id,
        );

        updateCacheWithUpdateForumFolder(
          cache,
          updatedForumFolder,
          variablesList,
        );

        present({
          message: tr('Success at updating forum folder!'),
          duration: 1500,
          position: 'top',
          color: 'success',
        });
      } else {
        console.log('useForumFolderUpdateMutation: ', errors);
        console.log(data?.forumFolderUpsert.error);

        present({
          message: `${tr('Failed at updating forum folder!')} [${data
            ?.forumFolderUpsert.error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        redirectOnUnauth(data?.forumFolderUpsert.error);
      }
    },
  });
}

export function useForumFolderCreateMutation() {
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

  return useGeneratedForumFolderCreateMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.forumFolderUpsert.folder &&
        data.forumFolderUpsert.error === ErrorType.NoError
      ) {
        const newForumFolder = data.forumFolderUpsert.folder;

        const variablesList = Object.values(getForumFoldersLists).filter(
          (variables) => variables.forum_id === newForumFolder.forum_id,
        );

        updateCacheWithCreateForumFolder(cache, newForumFolder, variablesList);

        present({
          message: tr('Success at creating new forum folder!'),
          duration: 1500,
          position: 'top',
          color: 'success',
        });
      } else {
        console.log('useForumFolderUpsertMutation: ', errors);
        console.log(data?.forumFolderUpsert.error);

        present({
          message: `${tr('Failed at creating new forum folder!')} [${data
            ?.forumFolderUpsert.error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        redirectOnUnauth(data?.forumFolderUpsert.error);
      }
    },
  });
}
