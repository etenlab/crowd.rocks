import { Injectable } from '@nestjs/common';
import { Args, Query, Resolver, Mutation, Context } from '@nestjs/graphql';
import { ErrorType } from 'src/common/types';

import { getBearer } from 'src/common/utility';
import { AuthenticationService } from '../authentication/authentication.service';
import { NotificationService } from './notification.service';
import {
  AddNotificationInput,
  AddNotificationOutput,
  MarkNotificationReadInput,
  MarkNotificationReadOutput,
  Notification,
  NotificationDeleteInput,
  NotificationDeleteOutput,
  NotificationListOutput,
} from './types';

@Injectable()
@Resolver(Notification)
export class NotificationResolver {
  constructor(
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService,
  ) {}

  @Query(() => NotificationListOutput)
  async notifications(@Context() req: any): Promise<NotificationListOutput> {
    console.log('notification list resolver');
    const bearer = getBearer(req);
    const user_id = await this.authenticationService.get_user_id_from_bearer(
      bearer,
    );
    if (!user_id) {
      return {
        error: ErrorType.Unauthorized,
        notifications: [],
      };
    }
    return this.notificationService.list(user_id + '');
  }

  @Mutation(() => AddNotificationOutput)
  async addNotification(
    @Args('input') input: AddNotificationInput,
    @Context() req: any,
  ): Promise<AddNotificationOutput> {
    console.log('add notification resolver, text: ', input.text);

    return this.notificationService.insert(input, getBearer(req));
  }

  @Mutation(() => MarkNotificationReadOutput)
  async markNotificationAsRead(
    @Args('input') input: MarkNotificationReadInput,
    @Context() req: any,
  ): Promise<MarkNotificationReadOutput> {
    console.log(
      'mark as read notification resolver, notification id: ',
      input.notification_id,
    );

    return this.notificationService.markAsRead(input, getBearer(req));
  }

  @Mutation(() => NotificationDeleteOutput)
  async notificationDelete(
    @Args('input') input: NotificationDeleteInput,
    @Context() req: any,
  ): Promise<NotificationDeleteOutput> {
    console.log(
      'notification delete resolver, notification_id: ',
      input.notification_id,
    );
    return this.notificationService.delete(input, getBearer(req));
  }
}
