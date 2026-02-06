import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { DeviceTokenService } from './device-token/device-token.service';
import { type Request } from 'express';
import { EventGateway } from './event/event.gateway';
import { SendEmailFormSchema } from './mailgun/schema';
import { z } from 'zod';
import { RecaptchaService } from './recaptcha/recaptcha.service';
import { MailgunService } from './mailgun/mailgun.service';
import { ZodValidatorPipe } from './zod-validator.pipe';

const SendEmailFormSchemaWithToken = SendEmailFormSchema.extend({
  platform: z.enum(['android']),
  token: z.string(),
});
type SendEmailFormWithToken = z.infer<typeof SendEmailFormSchemaWithToken>;

@Controller()
export class AppController {
  constructor(
    private readonly deviceTokenService: DeviceTokenService,
    private readonly recaptchaService: RecaptchaService,
    private readonly mailgun: MailgunService,
    private eventGateway: EventGateway,
  ) {}

  @Get('hello')
  getHello(@Req() req: Request): string {
    const message = `${req.user.name} says hello!`;
    this.eventGateway.notifyUser(req.user.uid, 'greeting', message);
    void this.deviceTokenService.broadcastMessage('Hi', message);
    return 'Message sent!';
  }

  @Post('feedback')
  async sendEmail(@Body(new ZodValidatorPipe(SendEmailFormSchemaWithToken)) data: SendEmailFormWithToken) {
    await this.recaptchaService.verifyToken({
      token: data.token,
      platform: data.platform,
      action: 'feedback',
    });

    const result = await this.mailgun.sendMail(data);

    return { success: result?.status === 200, status: result?.status };
  }
}
