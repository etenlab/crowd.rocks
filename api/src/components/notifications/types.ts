import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { GenericOutput } from 'src/common/types';

@ObjectType()
export class Notification {
  @Field(() => ID) id: string;
  @Field(() => Boolean) isNotified: boolean;
  @Field(() => String) text: string;
}

@InputType()
export class NotificationReadInput {
  @Field(() => ID) notification_id: string;
}

@ObjectType()
export class NotificationReadOutput extends GenericOutput {
  @Field(() => Notification, { nullable: true })
  notification: Notification | null;
}

@InputType()
export class AddNotificationInput {
  @Field(() => String) text: string;
  @Field(() => ID) user_id: string;
}

@InputType()
export class NotifyUsersInput {
  @Field(() => String) text: string;
  @Field(() => [ID]) user_ids: string[];
}

@InputType()
export class MarkNotificationReadInput {
  @Field(() => ID) notification_id: string;
}

@ObjectType()
export class MarkNotificationReadOutput extends GenericOutput {
  @Field(() => ID) notification_id: string;
}

@ObjectType()
export class AddNotificationOutput extends GenericOutput {
  @Field(() => Notification, { nullable: true })
  notification: Notification | null;
}

@InputType()
export class NotificationDeleteInput {
  @Field(() => ID) notification_id: string;
}

@ObjectType()
export class NotificationDeleteOutput extends GenericOutput {
  @Field(() => ID) notification_id: string;
}

@ObjectType()
export class NotificationListOutput extends GenericOutput {
  @Field(() => [Notification]) notifications: Notification[];
}
