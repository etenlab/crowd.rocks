import { useIonToast } from '@ionic/react';

import { useCreateForumMutation as useGeneratedForumUpsertMutation } from '../generated/graphql';
import { useUpdateForumMutation as useGeneratedForumUpdateMutation } from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { useTr } from './useTr';
import {
  updateCacheWithCreateForum,
  updateCacheWithUpdateForum,
} from '../cacheUpdators/upsertForum';

export function useForumUpdateMutation() {
  const { tr } = useTr();
  const [present] = useIonToast();

  return useGeneratedForumUpdateMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.forumUpsert.forum &&
        data.forumUpsert.error === ErrorType.NoError
      ) {
        const updatedForum = data.forumUpsert.forum;

        updateCacheWithUpdateForum(cache, updatedForum);

        present({
          message: tr('Success at updating forum!'),
          duration: 1500,
          position: 'top',
          color: 'success',
        });
      } else {
        console.log('useForumUpdateMutation: ', errors);
        console.log(data?.forumUpsert.error);

        present({
          message: `${tr('Failed at updating forum!')} [${data?.forumUpsert
            .error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
      }
    },
  });
}

export function useForumCreateMutation() {
  const { tr } = useTr();
  const [present] = useIonToast();

  return useGeneratedForumUpsertMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.forumUpsert.forum &&
        data.forumUpsert.error === ErrorType.NoError
      ) {
        const newForum = data.forumUpsert.forum;

        updateCacheWithCreateForum(cache, newForum);

        present({
          message: tr('Success at creating new forum!'),
          duration: 1500,
          position: 'top',
          color: 'success',
        });
      } else {
        console.log('useForumUpsertMutation: ', errors);
        console.log(data?.forumUpsert.error);

        present({
          message: `${tr('Failed at creating new forum!')} [${data?.forumUpsert
            .error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
      }
    },
  });
}
