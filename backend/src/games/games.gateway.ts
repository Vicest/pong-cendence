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
import { Interval } from '@nestjs/schedule';
import { GamesService } from './games.service';
import { Match } from './entities/match.entity';
import { PongInstance } from './instances/pong.instance';

@WebSocketGateway({
	cors: true,
	namespace: 'games'
})
export class GamesGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	private log: Logger;
	public ActiveMatches: Match[];
	private MatchInstances: { [key: number]: PongInstance } = {};

	@WebSocketServer()
	server: Namespace;

	constructor(
		private jwtService: JwtService,
		private gamesService: GamesService
	) {
		this.log = new Logger();
	}

	async afterInit(server) {
		this.ActiveMatches = await this.gamesService.getActiveMatches();
		this.ActiveMatches.forEach((match) => {
			switch (match.game.name) {
				case PongInstance.slug:
					this.MatchInstances[match.id] = new PongInstance(match);
					break;
			}
		});
	}

	@SubscribeMessage('input')
	handleGameInput(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		{
			data,
			gameId
		}: {
			gameId: number;
			data: { [key: number]: boolean }[];
		}
	) {
		this.MatchInstances[gameId].handleInput(client.data.user.id, data);
	}

	@Interval(1000 / 60)
	GameEngine() {
		this.ActiveMatches.forEach((match) => {
			this.MatchInstances[match.id].updateState();
			this.sendTick(match);
		});
	}

	private async sendTick(match: Match) {
		const state = this.MatchInstances[match.id].getState();
		if (state.status !== match.status) {
			this.gamesService.updateMatchStatus(match.id, state.status);
			this.ActiveMatches = await this.gamesService.getActiveMatches();
		}
		this.server.emit('tick', {
			gameId: match.game.id,
			state
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

	//TODO: On game creation add it to ActiveMatches
}
