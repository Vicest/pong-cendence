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
import { Match } from './entities/match.entity';
import { PongInstance } from './instances/pong.instance';
import { GamesService } from './games.service';
import { BoundlessInstance } from './instances/boundless.instance';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway({
	cors: true,
	namespace: 'games'
})
export class GamesGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	private log: Logger;
	public ActiveMatches: Match[];
	private MatchInstances: { [key: number]: PongInstance | BoundlessInstance } =
		{};

	@WebSocketServer()
	server: Namespace;

	constructor(
		private jwtService: JwtService,
		private userService: UsersService,
		private gamesService: GamesService
	) {
		this.log = new Logger();
	}

	async addMatch(_match: Match) {
		let active = await this.gamesService.getActiveMatches();
		const match = active.find((m) => m.id === _match.id);
		if (match) {
			switch (match.game.name) {
				case PongInstance.slug:
					this.MatchInstances[match.id] = new PongInstance(match);
					break;
				case BoundlessInstance.slug:
					this.MatchInstances[match.id] = new BoundlessInstance(match);
					break;
			}
			this.ActiveMatches.push(match);
		}
	}

	async afterInit(server) {
		this.ActiveMatches = await this.gamesService.getActiveMatches();
		this.ActiveMatches.forEach((match) => {
			switch (match.game.name) {
				case PongInstance.slug:
					this.MatchInstances[match.id] = new PongInstance(match);
					break;
				case BoundlessInstance.slug:
					this.MatchInstances[match.id] = new BoundlessInstance(match);
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
		if (typeof this.ActiveMatches === 'undefined') return;
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
			if (state.status === 'finished') {
				console.log('Match: ', match, '\nState: ', state);
				this.gamesService.setMatchWinner(match.id, state.winnerId);
				this.userService.updateStatusById(state.players[0].id, 'online');
				this.userService.updateStatusById(state.players[1].id, 'online');
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

	handleConnection(@ConnectedSocket() client: Socket) {
		try {
			const decoded = this.jwtService.verify(this.getAuthCookie(client));
			client.data.user = decoded;
			client.join(decoded.id.toString());
			this.log.debug(`${decoded.login} connected`, this.constructor.name);
		} catch (error) {
			this.log.error(`${error}`, this.constructor.name);
			client.disconnect();
		}
	}

	async handleDisconnect(@ConnectedSocket() client: Socket) {
		const id: number = client.data.user.id;
		client.leave(id.toString());
		this.log.debug(
			`${client.data.user.login} disconnected an instance`,
			this.constructor.name
		);

		const clientInstances = await this.server.in(id.toString()).fetchSockets();
		if (clientInstances.length === 0) {
			for (let gameId in this.MatchInstances) {
				const match = this.MatchInstances[gameId];
				let state = match.getState();
				if (state.status === 'finished') continue;
				if (state.players[0].id === id || state.players[1].id === id) {
					state.status = 'finished';
					if (state.players[0].id === id) state.winnerId = state.players[1].id;
					else state.winnerId = state.players[0].id;
				}
			}
			this.log.debug(
				`${client.data.user.login} disconnected all instances`,
				this.constructor.name
			);
		}
	}

	//TODO: On game creation add it to ActiveMatches
}
