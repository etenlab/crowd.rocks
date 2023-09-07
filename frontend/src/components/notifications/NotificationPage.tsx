import { useCallback, useEffect, useMemo } from 'react';
import { RouteComponentProps } from 'react-router';
import { useIonToast } from '@ionic/react';
import {
  ErrorType,
  useListNotificationsLazyQuery,
} from '../../generated/graphql';
import { useTr } from '../../hooks/useTr';
import {
  CaptionContainer,
  CardContainer,
  CardListContainer,
} from '../common/styled';
import {
  NotificationCard,
  NotificationInfo,
} from './NotificationCard/NotificationCard';
import { PageLayout } from '../common/PageLayout';
import { Caption } from '../common/Caption/Caption';
import { useMarkNotificationReadMutation } from '../../hooks/useMarkNotificationReadMutation';
import { useDeleteNotificationMutation } from '../../hooks/useDeleteNotificationMutation';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface NotificationPageProps
  extends RouteComponentProps<{
    nation_id: string;
    language_id: string;
  }> {}

export function NotificationPage() {
  const { tr } = useTr();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [present] = useIonToast();

  const [getNotifications, { data: notificationData, error }] =
    useListNotificationsLazyQuery();

  const [markNotificationRead] = useMarkNotificationReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  useEffect(() => {
    getNotifications();
  }, [getNotifications]);

  const handleNotified = useCallback(
    (id: string) => {
      markNotificationRead({ variables: { id } });
    },
    [markNotificationRead],
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteNotification({ variables: { id } });
    },
    [deleteNotification],
  );

  const cardListComs = useMemo(() => {
    if (error) {
      return null;
    }

    if (
      !notificationData ||
      notificationData.notifications.error !== ErrorType.NoError
    ) {
      return null;
    }

    const tempNotifications: NotificationInfo[] = [];

    const allNotifications = notificationData.notifications.notifications;
    if (!allNotifications) {
      return null;
    }
    for (const n of allNotifications) {
      tempNotifications.push({
        id: n.id,
        text: n.text,
        isRead: n.isNotified,
      });
    }

    return tempNotifications.map((n) => (
      <CardContainer key={n.id}>
        <NotificationCard
          key={n.id}
          info={n}
          onClick={!n.isRead ? () => handleNotified(n.id) : undefined}
          onDeleteClick={() => handleDelete(n.id)}
        />
      </CardContainer>
    ));
  }, [error, handleDelete, handleNotified, notificationData]);

  return (
    <PageLayout>
      <CaptionContainer>
        <Caption>{tr('Notifications')}</Caption>
      </CaptionContainer>

      <CardListContainer>
        {cardListComs?.length ? cardListComs : 'No notifications at this time'}
      </CardListContainer>
    </PageLayout>
  );
}
