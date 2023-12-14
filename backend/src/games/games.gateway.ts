import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	WsException
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { GamesService } from './games.service';
import { Match } from './entities/match.entity';
import { PongInstance } from './instances/pong.instance';

@WebSocketGateway({
	cors: {
		origin: `${process.env.BACKEND_BASE}:${process.env.FRONTEND_PORT}`,
		credentials: true
	},
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

	@SubscribeMessage('join')
	async handleJoinGame(
		@ConnectedSocket() client: Socket,
		@MessageBody() gameId: number
	) {
		client.join(`match:${gameId}`);
		const match = this.ActiveMatches.find((match) => match.id === gameId);
		if (!match) return;
		this.server.to(`match:${gameId}`).emit('tick', {
			gameId: match.id,
			state: this.MatchInstances[gameId].getState()
		});
	}

	@SubscribeMessage('reset')
	async handleResetGame(
		@ConnectedSocket() client: Socket,
		@MessageBody() gameId: string
	) {
		let id = parseInt(gameId);
		this.gamesService.updateMatchStatus(id, 'running');
		this.ActiveMatches = await this.gamesService.getActiveMatches();
		if (!this.MatchInstances[id]) {
			this.MatchInstances[id] = new PongInstance(
				this.ActiveMatches.find((match) => match.id === id)
			);
		}
	}

	@SubscribeMessage('leave')
	async handleLeaveGame(
		@ConnectedSocket() client: Socket,
		@MessageBody() gameId: number
	) {
		const match = this.ActiveMatches.find((match) => match.id === gameId);
		if (!match) return;
		client.leave(`match:${match.id}`);
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
		if (!this.MatchInstances[gameId])
			throw new WsException('No such game instance');
		this.MatchInstances[gameId].handleInput(client.data.user.id, data);
	}

	@Interval(1000 / 60)
	GameEngine() {
		this.ActiveMatches.forEach(async (match, key) => {
			const previousState = JSON.parse(
				JSON.stringify(this.MatchInstances[match.id].getState())
			);
			this.MatchInstances[match.id].updateState();
			const state = this.MatchInstances[match.id].getState();
			let changed = false;
			if (state.status !== match.status) {
				this.gamesService.updateMatchStatus(match.id, state.status);
				this.ActiveMatches = await this.gamesService.getActiveMatches();
				changed = true;
			}
			if (changed || JSON.stringify(previousState) !== JSON.stringify(state)) {
				this.sendTick(match, state);
			}
		});
	}

	private async sendTick(match: Match, state: PongInstance['state']) {
		this.server.to(`match:${match.id}`).emit('tick', {
			gameId: match.id,
			state
		});
	}

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
			this.log.debug(`${decoded.login} connected`, this.constructor.name);
		} catch (error) {
			this.log.error(`${error}`, this.constructor.name);
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
