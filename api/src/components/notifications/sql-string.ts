import { ErrorType } from 'src/common/types';

export type GetNotificationObjectById = {
  text: string;
  is_notified: boolean;
  notification_id: string;
};

export function getNotificationObjById(id: number): [string, [number]] {
  return [
    `
      select 
        notification_id,
        is_notified,
        text
      from notifications
      where notifications.notification_id = $1
    `,
    [id],
  ];
}

export function getNotifications(user_id: number): [string, [number]] {
  return [
    `select 
      notification_id, is_notified, text
    from notifications
    where user_id = $1
  `,
    [user_id],
  ];
}

export type NotificationUpsertProcedureOutputRow = {
  p_notification_id: number;
  p_error_type: ErrorType;
};

export function callInsertNotificationProcedure({
  user_id,
  text,
  token,
}: {
  user_id: number;
  text: string;
  token: string;
}): [string, [number, string, string]] {
  return [
    `
      call notification_insert($1, $2, $3,null,null);
    `,
    [user_id, text, token],
  ];
}

export function callMarkNotificationAsReadProcedure({
  notification_id,
  token,
}: {
  notification_id: number;
  token: string;
}): [string, [number, string]] {
  return [
    `
      call mark_notification_as_read($1, $2, null);
    `,
    [notification_id, token],
  ];
}

export type NotificationDeleteProcedureOutputRow = {
  p_notification_id: number;
  p_error_type: ErrorType;
};

export function callNotificationDeleteProcedure({
  id,
  token,
}: {
  id: string;
  token: string;
}): [string, [string, string]] {
  return [
    `
      call notification_delete($1, $2, null);
    `,
    [token, id],
  ];
}
