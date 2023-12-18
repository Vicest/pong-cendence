import {
	ConnectedSocket,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import { ChatService } from '../chat.service';

@WebSocketGateway({
	cors: true,
	namespace: 'chats'
})
export class ChatGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	private log: Logger;
	constructor(
		private jwtService: JwtService,
		private chatService: ChatService
	) {
		this.log = new Logger();
	}

	@WebSocketServer()
	server: Namespace;

	afterInit(server) {}

	handleConnection(@ConnectedSocket() client: Socket, ...args) {
		try {
			const decoded = this.jwtService.verify(client.handshake.auth.token);
			client.data.user = decoded;
			this.log.debug(`${decoded.login} connected`, this.constructor.name);
		} catch (error) {
			client.disconnect();
		}
	}

	handleDisconnect(client) {
		this.log.debug(
			`${client.data.user.login} disconnected`,
			this.constructor.name
		);
	}
}
