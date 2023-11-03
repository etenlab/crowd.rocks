import { useIonToast } from '@ionic/react';

import { useCreateForumMutation as useGeneratedForumUpsertMutation } from '../generated/graphql';
import { useUpdateForumMutation as useGeneratedForumUpdateMutation } from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { useTr } from './useTr';
import { useAppContext } from './useAppContext';

import {
  updateCacheWithCreateForum,
  updateCacheWithUpdateForum,
} from '../cacheUpdators/upsertForum';
import { useUnauthorizedRedirect } from './useUnauthorizedRedirect';

export function useForumUpdateMutation() {
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

  return useGeneratedForumUpdateMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.forumUpsert.forum &&
        data.forumUpsert.error === ErrorType.NoError
      ) {
        const updatedForum = data.forumUpsert.forum;

        const variablesList = Object.values(getForumsLists);

        updateCacheWithUpdateForum(cache, updatedForum, variablesList);

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
        redirectOnUnauth(data?.forumUpsert.error);
      }
    },
  });
}

export function useForumCreateMutation() {
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

  return useGeneratedForumUpsertMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.forumUpsert.forum &&
        data.forumUpsert.error === ErrorType.NoError
      ) {
        const newForum = data.forumUpsert.forum;

        const variablesList = Object.values(getForumsLists);

        updateCacheWithCreateForum(cache, newForum, variablesList);

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
        redirectOnUnauth(data?.forumUpsert.error);
      }
    },
  });
}
