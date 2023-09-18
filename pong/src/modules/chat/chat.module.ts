import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';

@Module({
  controllers: [],
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class ChatModule {}
