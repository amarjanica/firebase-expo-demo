import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';

@Module({
  imports: [],
  providers: [EventGateway],
  exports: [EventGateway],
})
export class EventModule {}
