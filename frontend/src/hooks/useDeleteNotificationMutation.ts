import { useIonToast } from '@ionic/react';
import { useDeleteNotificationMutation as useGeneratedDeleteMutation } from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { useTr } from './useTr';
import { updateCacheWithDeleteNotification } from '../cacheUpdators/deleteNotification';

export function useDeleteNotificationMutation() {
  const { tr } = useTr();
  const [present] = useIonToast();

  return useGeneratedDeleteMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.notificationDelete.error &&
        data.notificationDelete.error == ErrorType.NoError
      ) {
        updateCacheWithDeleteNotification(
          cache,
          data.notificationDelete.notification_id,
        );
      } else {
        console.log('useDeleteNotificationMutation: ', errors);
        console.log(data?.notificationDelete.error);

        present({
          message: `${tr('Failed at deleting notification!')} [${data
            ?.notificationDelete.error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
      }
    },
  });
}
