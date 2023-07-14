import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { GenericOutput } from 'src/common/types'

@InputType()
export class EmailResponseInput {
  @Field() readonly token: string
}

@ObjectType()
export class EmailResponseOutput extends GenericOutput {}

export type SNSSubscriptionPayload = {
  Type: string
  MessageId: string
  Token: string
  TopicArn: string
  Subject: string
  Message: string
  SubscribeURL: string
  Timestamp: string
  SignatureVersion: string
  Signature: string
  SigningCertURL: string
  UnsubscribeURL: string
}

export type Recipients = {
  emailAddress: string
}

export type Complaint = {
  complainedRecipients: Array<Recipients>
}

export type Bounce = {
  bounceType: string
  bouncedRecipients: Array<Recipients>
}

export type Delivery = {
  recipients: Array<string>
}

export type Mail = {
  source: string
  messageId: string
  destination: Array<string>
}

export type SESNotificationPayload = {
  notificationType: string
  mail: Mail
  bounce: Bounce
  complaint: Complaint
}
