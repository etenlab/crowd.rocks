import { useIonToast } from '@ionic/react';

import { useCreateForumMutation as useGeneratedForumUpsertMutation } from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { useTr } from './useTr';
import { updateCacheWithUpsertForum } from '../cacheUpdators/upsertForum';

export function useForumUpsertMutation() {
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

        updateCacheWithUpsertForum(cache, newForum);

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
