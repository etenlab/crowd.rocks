import { Body, Controller, Post } from '@nestjs/common';
import { ConfigService } from 'src/core/config.service';
import { PostgresService } from 'src/core/postgres.service';
import { SESNotificationPayload } from './types';

@Controller()
export class SnsController {
  constructor(private pg: PostgresService, private config: ConfigService) {}

  @Post('sns')
  async sns_delivery(
    @Body() notification: SESNotificationPayload,
  ): Promise<string> {
    const message_id = notification?.mail?.messageId;
    const email = notification?.mail?.destination[0];

    if (!message_id || !email) return 'missing message id or recipient';

    await this.pg.pool.query(
      `
        update emails_sent 
        set response = 'Delivery' 
        where message_id = $1 
        and email = $2;
      `,
      [message_id, email],
    );

    return 'delivery processed';
  }

  @Post('sns-bounce')
  async sns_bounce(
    @Body() notification: SESNotificationPayload,
  ): Promise<string> {
    const message_id = notification?.mail?.messageId;
    const email = notification?.bounce?.bouncedRecipients[0]?.emailAddress;

    if (!message_id || !email) return 'missing message id or recipient';

    await this.pg.pool.query(
      `
        update emails_sent 
        set response = 'Bounce' 
        where message_id = $1 
        and email = $2;
      `,
      [message_id, email],
    );

    return 'bounce processed';
  }

  @Post('sns-complaint')
  async sns_complaint(
    @Body() notification: SESNotificationPayload,
  ): Promise<string> {
    const message_id = notification?.mail?.messageId;
    const email =
      notification?.complaint?.complainedRecipients[0]?.emailAddress;

    if (!message_id || !email) return 'missing message id or recipient';

    await this.pg.pool.query(
      `
        update emails_sent 
        set response = 'Complaint' 
        where message_id = $1 
        and email = $2;
      `,
      [message_id, email],
    );

    return 'complaint processed';
  }
}
