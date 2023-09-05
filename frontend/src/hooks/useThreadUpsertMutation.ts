import { useIonToast } from '@ionic/react';

import { useCreateThreadMutation as useGeneratedThreadUpsertMutation } from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { useTr } from './useTr';
import { updateCacheWithUpsertThread } from '../cacheUpdators/upsertThread';

export function useThreadUpsertMutation(folder_id: string) {
  const { tr } = useTr();
  const [present] = useIonToast();

  return useGeneratedThreadUpsertMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.threadUpsert.thread &&
        data.threadUpsert.error === ErrorType.NoError
      ) {
        const newThread = data.threadUpsert.thread;

        updateCacheWithUpsertThread(cache, newThread, folder_id);

        present({
          message: tr('Success at creating new thread!'),
          duration: 1500,
          position: 'top',
          color: 'success',
        });
      } else {
        console.log('useThreadUpsertMutation: ', errors);
        console.log(data?.threadUpsert.error);

        present({
          message: `${tr('Failed at creating new thread!')} [${data
            ?.threadUpsert.error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
      }
    },
  });
}
