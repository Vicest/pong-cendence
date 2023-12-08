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
import { UsersService } from './users.service';

@WebSocketGateway({
	cors: true,
	namespace: 'users'
})
export class UsersGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	private log: Logger;
	constructor(
		private jwtService: JwtService,
		private usersService: UsersService
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
			setTimeout(() => {
				this.usersService.updateStatusById(client.data.user.id, 'online');
			}, 500);
			this.log.debug(`${decoded.login} connected`, this.constructor.name);
		} catch (error) {
			client.disconnect();
		}
	}

	handleDisconnect(client) {
		this.usersService.updateStatusById(client.data.user.id, 'offline');
		this.log.debug(
			`${client.data.user.login} disconnected`,
			this.constructor.name
		);
	}
}
