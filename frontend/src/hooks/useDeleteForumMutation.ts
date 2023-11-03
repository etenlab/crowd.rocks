import { useIonToast } from '@ionic/react';

import { useDeleteForumMutation as useGeneratedDeleteForumMutation } from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { useTr } from './useTr';
import { useAppContext } from './useAppContext';

import { updateCacheWithDeleteForum } from '../cacheUpdators/deleteForum';
import { useUnauthorizedRedirect } from './useUnauthorizedRedirect';

export function useDeleteForumMutation() {
  const { tr } = useTr();
  const {
    states: {
      nonPersistent: {
        paginationVariables: { getForumsLists },
      },
    },
  } = useAppContext();
  const [present] = useIonToast();
  const redirectOnUnauth = useUnauthorizedRedirect();

  return useGeneratedDeleteForumMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.forumDelete.forum_id &&
        data.forumDelete.error === ErrorType.NoError
      ) {
        const deletedForumId = data.forumDelete.forum_id;

        const variablesList = Object.values(getForumsLists);

        updateCacheWithDeleteForum(cache, deletedForumId, variablesList);

        present({
          message: tr('Success at deleting forum!'),
          duration: 1500,
          position: 'top',
          color: 'success',
        });
      } else {
        console.log('useDeleteForumMutation: ', errors);
        console.log(data?.forumDelete.error);

        present({
          message: `${tr('Failed at updating forum!')} [${data?.forumDelete
            .error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        redirectOnUnauth(data?.forumDelete.error);
      }
    },
  });
}
