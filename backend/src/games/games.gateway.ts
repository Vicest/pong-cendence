import {
	ConnectedSocket,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Inject, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';

@WebSocketGateway({
	cors: true,
	namespace: 'games'
})
export class GamesGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	private log: Logger;
	private gameEvents: any = [];
	private tickStartDate = new Date().getTime();
	private UserIoInstances: {
		[game_id: number]: [
			{
				user_id: number;
				socket: Socket;
				properties: {
					[key: number]: boolean;
				};
			}
		];
	} = {};

	constructor(private jwtService: JwtService) {
		this.log = new Logger();
	}

	@WebSocketServer()
	server: Namespace;

	afterInit(server) {}

	@SubscribeMessage('IoEvent')
	handleMessage(
		client: Socket,
		payload: {
			user_id: number;
			game: number;
			keysPressed: {
				[key: string]: boolean;
			};
		}
	) {
		let diff = false;
		if (typeof this.UserIoInstances[payload.game] === 'undefined')
			this.UserIoInstances[payload.game] = [
				{
					user_id: client.data.user.id,
					socket: client,
					properties: payload.keysPressed
				}
			];
		let user = this.UserIoInstances[payload.game].find(
			(user) => user.user_id === client.data.user.id
		);
		if (!user) {
			this.UserIoInstances[payload.game].push({
				user_id: client.data.user.id,
				socket: client,
				properties: payload.keysPressed
			});
			diff = true;
		} else {
			if (
				JSON.stringify(user.properties) !== JSON.stringify(payload.keysPressed)
			) {
				user.properties = payload.keysPressed;
				diff = true;
			}
		}

		if (diff)
			this.log.debug(
				`client ${client.data.user.login} updated his io to ${JSON.stringify(
					payload.keysPressed
				)}`,
				this.constructor.name
			);
	}

	@Interval(1000 / 60)
	inputEngine() {
		Object.keys(this.UserIoInstances).forEach((game_id) => {
			let game = this.UserIoInstances[game_id];
			this.server.emit('IoEvent', {
				game: parseInt(game_id),
				users: game.map((user) => {
					return {
						user_id: user.socket.data.user.id,
						properties: user.properties
					};
				})
			});
		});
	}

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
