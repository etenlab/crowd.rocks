import { useIonToast } from '@ionic/react';
import { useMarkNotificationReadMutation as useGeneratedMarkNotificationReadMutation } from '../generated/graphql';

import { ErrorType } from '../generated/graphql';

import { useTr } from './useTr';
import { updateCacheWithReadNotification } from '../cacheUpdators/readNotification';

export function useMarkNotificationReadMutation() {
  const { tr } = useTr();
  const [present] = useIonToast();

  return useGeneratedMarkNotificationReadMutation({
    update(cache, { data, errors }) {
      if (
        !errors &&
        data &&
        data.markNotificationAsRead.error &&
        data.markNotificationAsRead.error == ErrorType.NoError
      ) {
        updateCacheWithReadNotification(
          cache,
          data.markNotificationAsRead.notification_id,
        );
      } else {
        console.log('useMarkNotificationReadMutation: ', errors);
        console.log(data?.markNotificationAsRead.error);

        present({
          message: `${tr('Failed at marking notification read!')} [${data
            ?.markNotificationAsRead.error}]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
      }
    },
  });
}
