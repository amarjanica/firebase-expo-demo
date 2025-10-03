import { Controller, Get, Req } from '@nestjs/common';
import { DeviceTokenService } from './device-token/device-token.service';
import { type Request } from 'express';
import { EventGateway } from './event/event.gateway';

@Controller()
export class AppController {
  constructor(
    private readonly deviceTokenService: DeviceTokenService,
    private eventGateway: EventGateway,
  ) {}

  @Get('hello')
  getHello(@Req() req: Request): string {
    const message = `${req.user.name} says hello!`;
    this.eventGateway.notifyUser(req.user.uid, 'greeting', message);
    this.deviceTokenService.broadcastMessage('Hi', message);
    return 'Message sent!';
  }
}
