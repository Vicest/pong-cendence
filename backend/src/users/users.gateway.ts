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
import { Inject, Logger, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';

@WebSocketGateway({
	cors: {
		origin: `${process.env.BACKEND_BASE}:${process.env.FRONTEND_PORT}`,
		credentials: true
	},
	namespace: 'users'
})
export class UsersGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	private log: Logger;
	constructor(
		private jwtService: JwtService,
		@Inject(forwardRef(() => UsersService)) private usersService: UsersService
	) {
		this.log = new Logger();
	}

	@WebSocketServer()
	server: Namespace;

	afterInit(server) {}

	private getAuthCookie(socket: Socket) {
		if (!socket.request.headers?.cookie) {
			throw new Error('Missing cookie header');
		}
		const token = socket.request.headers.cookie
			.split(';')
			.find((cookie) => cookie.trim().startsWith('token='));
		if (!token) throw new Error('Missing token cookie');
		return token.split('=')[1];
	}

	handleConnection(@ConnectedSocket() client: Socket, ...args) {
		try {
			const decoded = this.jwtService.verify(this.getAuthCookie(client));
			client.data.user = decoded;
			setTimeout(() => {
				this.usersService.updateStatusById(client.data.user.id, 'online');
			}, 500);
			client.join('user_' + decoded.id);
			this.log.debug(`${decoded.login} connected`, this.constructor.name);
			client.join(decoded.id.toString());
		} catch (error) {
			this.log.error(error, this.constructor.name);
			client.disconnect();
		}
	}

	async handleDisconnect(@ConnectedSocket() client: Socket,) {
		const id: number = client.data.user.id;
		client.leave(id.toString());
		this.log.debug(
			`${client.data.user.login} disconnected an instance`,
			this.constructor.name
		);

		const clientInstances = await this.server.in(id.toString()).fetchSockets();
		if (clientInstances.length == 0) {
			this.usersService.updateStatusById(client.data.user.id, 'offline');
			this.log.debug(
				`${client.data.user.login} disconnected all instances`,
				this.constructor.name
			);
		}
	}
}
