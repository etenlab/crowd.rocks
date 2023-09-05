import { useIonToast } from '@ionic/react';

import { useCreateForumFolderMutation as useGeneratedForumFolderUpsertMutation } from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { useTr } from './useTr';
import { updateCacheWithUpsertForumFolder } from '../cacheUpdators/upsertForumFolder';

export function useForumFolderUpsertMutation(forum_id: string) {
  const { tr } = useTr();
  const [present] = useIonToast();

  return useGeneratedForumFolderUpsertMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.forumFolderUpsert.folder &&
        data.forumFolderUpsert.error === ErrorType.NoError
      ) {
        const newForumFolder = data.forumFolderUpsert.folder;

        updateCacheWithUpsertForumFolder(cache, newForumFolder, forum_id);

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
      }
    },
  });
}
