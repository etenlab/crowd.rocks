import { SendEmailCommand, SESv2Client } from '@aws-sdk/client-sesv2';
import { Injectable } from '@nestjs/common';
import { ConfigService } from './config.service';

@Injectable()
export class SesService {
  constructor(private config: ConfigService) {}

  public client = new SESv2Client({
    credentials: {
      accessKeyId: this.config.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: this.config.AWS_SECRET_ACCESS_KEY || '',
    },
    region: this.config.AWS_REGION,
  });

  async send_email(
    to_address: string,
    from_address: string,
    subject: string,
    html_content: string,
    text_content: string,
  ) {
    try {
      const data = await this.client.send(
        new SendEmailCommand({
          FromEmailAddress: from_address,
          Destination: { ToAddresses: [to_address] },
          Content: {
            Simple: {
              Subject: {
                Charset: 'UTF-8',
                Data: subject,
              },
              Body: {
                Html: {
                  Charset: 'UTF-8',
                  Data: html_content,
                },
                Text: {
                  Charset: 'UTF-8',
                  Data: text_content,
                },
              },
            },
          },
        }),
      );
      // process data.
      return data;
    } catch (error) {
      // error handling.
      console.log('error sending email', error);
    } finally {
      // finally.
    }
  }
}
