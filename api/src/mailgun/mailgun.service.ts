import { Injectable } from '@nestjs/common';
import { EnvConfigService } from '../config/env-config.service';
import Mailgun from 'mailgun.js';
import formData from 'form-data';
import { SendEmailForm } from './schema';
import { EmailSendFailedError } from './errors';
import { MessagesSendResult } from 'mailgun.js/definitions';

@Injectable()
export class MailgunService {
  private readonly client: ReturnType<Mailgun['client']>;

  constructor(private readonly config: EnvConfigService) {
    const mailgun = new Mailgun(formData);
    const region = this.config.get('MAILGUN_REGION');
    const url = region === 'EU' ? 'https://api.eu.mailgun.net' : 'https://api.mailgun.net';

    this.client = mailgun.client({
      username: 'api',
      url,
      key: this.config.get('MAILGUN_SENDING_KEY'),
    });
  }

  async sendMail(data: SendEmailForm): Promise<MessagesSendResult> {
    const domain = this.config.get('MAILGUN_DOMAIN');
    const to = this.config.get('MAILGUN_TO');
    const replyTo = data.name ? `${data.name} <${data.from}>` : data.from;
    const text = `
        Message from: ${replyTo}
        ------------------------------
        ${data.message}
        `;

    try {
      return await this.client.messages.create(domain, {
        from: this.config.get('MAILGUN_FROM'),
        to,
        subject: `Feedback: ${data.subject}`,
        text,
        'h:Reply-To': replyTo,
      });
    } catch (err) {
      throw new EmailSendFailedError(err instanceof Error ? err.message : undefined);
    }
  }
}
