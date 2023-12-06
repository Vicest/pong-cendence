import { Controller } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, ConnectedSocket,MessageBody} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@Controller('sockets')
export class SocketsController 
{

}
