import { useIonToast } from '@ionic/react';

import { useDeleteThreadMutation as useGeneratedDeleteThreadMutation } from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { useTr } from './useTr';
import { useAppContext } from './useAppContext';

import { updateCacheWithDeleteThread } from '../cacheUpdators/deleteThread';
import { useUnauthorizedRedirect } from './useUnauthorizedRedirect';

export function useDeleteThreadMutation(forum_folder_id: string) {
  const { tr } = useTr();
  const {
    states: {
      nonPersistent: {
        paginationVariables: { getThreadsLists },
      },
    },
  } = useAppContext();
  const [present] = useIonToast();
  const redirectOnUnauth = useUnauthorizedRedirect();

  return useGeneratedDeleteThreadMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.threadDelete.thread_id &&
        data.threadDelete.error === ErrorType.NoError
      ) {
        const deletedThreadId = data.threadDelete.thread_id;

        const variablesList = Object.values(getThreadsLists).filter(
          (variables) => variables.forum_folder_id === forum_folder_id,
        );

        updateCacheWithDeleteThread(cache, deletedThreadId, variablesList);

        present({
          message: tr('Success at deleting thread!'),
          duration: 1500,
          position: 'top',
          color: 'success',
        });
      } else {
        console.log('useDeleteThreadMutation: ', errors);
        console.log(data?.threadDelete.error);

        present({
          message: `${tr('Failed at updating thread!')} [${data?.threadDelete
            .error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        redirectOnUnauth(data?.threadDelete.error);
      }
    },
  });
}
