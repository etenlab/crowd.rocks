import { ApolloCache } from '@apollo/client';

import {
  ListNotificationsDocument,
  ListNotificationsQuery,
} from '../generated/graphql';

export function updateCacheWithDeleteNotification(
  cache: ApolloCache<unknown>,
  notification_id: string,
) {
  cache.updateQuery<ListNotificationsQuery>(
    {
      query: ListNotificationsDocument,
    },
    (data) => {
      if (data) {
        const updatedNotifications = data.notifications.notifications.filter(
          (n) => {
            if (n.id != notification_id) return n;
          },
        );

        return {
          ...data,
          notifications: {
            ...data.notifications,
            notifications: [...updatedNotifications],
          },
        };
      } else {
        return data;
      }
    },
  );
}
