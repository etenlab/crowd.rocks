import { Injectable } from '@nestjs/common';
import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';
import {
  callNotificationDeleteProcedure,
  callInsertNotificationProcedure,
  NotificationDeleteProcedureOutputRow,
  NotificationUpsertProcedureOutputRow,
  getNotificationObjById,
  GetNotificationObjectById,
  callMarkNotificationAsReadProcedure,
} from './sql-string';
import {
  Notification,
  NotificationDeleteInput,
  NotificationDeleteOutput,
  NotificationListOutput,
  NotificationReadInput,
  NotificationReadOutput,
  AddNotificationInput,
  MarkNotificationReadInput,
  MarkNotificationReadOutput,
} from './types';

@Injectable()
export class NotificationService {
  constructor(private pg: PostgresService) {}

  async read(input: NotificationReadInput): Promise<NotificationReadOutput> {
    const res1 = await this.pg.pool.query<GetNotificationObjectById>(
      ...getNotificationObjById(+input.notification_id),
    );

    if (res1.rowCount !== 1) {
      console.error(`no notification for id: ${input.notification_id}`);
    } else {
      return {
        error: ErrorType.NoError,
        notification: {
          id: input.notification_id,
          text: res1.rows[0].text,
          isNotified: res1.rows[0].is_notified,
        },
      };
    }

    return {
      error: ErrorType.UnknownError,
      notification: null,
    };
  }

  async list(user_id: string): Promise<NotificationListOutput> {
    const res1 = await this.pg.pool.query(
      `
        select
          notification_id,
          is_notified,
          text
        from 
          notifications
        where user_id = $1
      `,
      [user_id],
    );
    const notifications = res1.rows.map<Notification>(
      ({ notification_id, is_notified, text }) => ({
        id: notification_id,
        isNotified: is_notified,
        text,
      }),
    );

    return {
      error: ErrorType.NoError,
      notifications,
    };
  }

  async markAsRead(
    input: MarkNotificationReadInput,
    token: string,
  ): Promise<MarkNotificationReadOutput> {
    const res1 = await this.pg.pool.query(
      ...callMarkNotificationAsReadProcedure({
        notification_id: +input.notification_id,
        token,
      }),
    );

    return {
      notification_id: input.notification_id,
      error: res1.rows[0].p_error_type,
    };
  }

  async insert(
    input: AddNotificationInput,
    token: string,
  ): Promise<NotificationReadOutput> {
    try {
      const res =
        await this.pg.pool.query<NotificationUpsertProcedureOutputRow>(
          ...callInsertNotificationProcedure({
            user_id: +input.user_id,
            text: input.text,
            token: token,
          }),
        );

      const creatingError = res.rows[0].p_error_type;
      const notification_id = res.rows[0].p_notification_id;

      if (creatingError !== ErrorType.NoError || !notification_id) {
        return {
          error: creatingError,
          notification: null,
        };
      }

      const { error: readingError, notification } = await this.read({
        notification_id: notification_id + '',
      });

      return {
        error: readingError,
        notification,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      notification: null,
    };
  }

  async delete(
    input: NotificationDeleteInput,
    token: string,
  ): Promise<NotificationDeleteOutput> {
    const res = await this.pg.pool.query<NotificationDeleteProcedureOutputRow>(
      ...callNotificationDeleteProcedure({
        id: input.notification_id,
        token: token,
      }),
    );

    const deletingError = res.rows[0].p_error_type;

    return {
      error: deletingError,
      notification_id: res.rows[0].p_notification_id + '',
    };
  }
}
