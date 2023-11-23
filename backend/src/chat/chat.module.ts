import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { UsersModule } from '../users/users.module';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [UsersModule], 
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
  exports: [ChatGateway]
})
export class ChatModule {}
