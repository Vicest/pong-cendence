import {
	ConnectedSocket,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';

@WebSocketGateway({
	cors: true,
})
export class UsersGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	server: Namespace;

	afterInit(server) {
		console.log('Init');
	}

	handleConnection(@ConnectedSocket() client: Socket, ...args) {
		console.log('Connect');
	}

	handleDisconnect(client) {
		console.log('Disconnect');
	}
}
