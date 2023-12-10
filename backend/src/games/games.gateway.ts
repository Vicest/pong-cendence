import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import { GamesService } from './games.service';

@WebSocketGateway({
	cors: true,
	namespace: 'games'
})
export class GamesGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	private log: Logger;

	constructor(private jwtService: JwtService, private gamesService: GamesService) {
		this.log = new Logger();
	}

	@WebSocketServer()
	server: Namespace;

	afterInit(server) {}

	handleConnection(@ConnectedSocket() client: Socket, ...args) {
		try {
//			const decoded = this.jwtService.verify(client.handshake.auth.token); TODO
			console.log("The WS token", client.handshake.headers.token, "adasd", typeof(client.handshake.headers.token))
			const decoded = this.jwtService.verify(client.handshake.headers.token as string, 'NMmbH3K50J81sihwwfMUupMwNoWxK5j0');
			console.log(decoded)
			client.data.user = decoded;
			this.log.debug(`${decoded.login} connected`, this.constructor.name);
		} catch (error) {
			console.log(error)
			client.disconnect();
		}
	}

	handleDisconnect(client) {
		this.log.debug(
			`${client.data.user.login} disconnected`,
			this.constructor.name
		);
	}

	@SubscribeMessage('joinQueue')
	onJoinQueue(@MessageBody() id:number) {
		console.log('loined')
		this.gamesService.joinQueue(id);
	}

	@SubscribeMessage('leaveQueue')
	onLeaveQueue(@MessageBody() id:number) {
		this.gamesService.leaveQueue(id);
	}
}
