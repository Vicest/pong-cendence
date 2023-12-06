import { Module } from '@nestjs/common';
import { SocketsController } from './sockets.controller';
import { SocketsService } from './sockets.service';


@Module({
  controllers: [SocketsController],
  providers: [SocketsService]
})
export class SocketsModule {}