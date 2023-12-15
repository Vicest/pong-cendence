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
import { Challenge } from './challenge';
import { GamesService } from 'src/games/games.service';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway({
	cors: true,
	namespace: 'matchmaking'
})
export class MatchMakingGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	private log: Logger;
	private pendingChallenges_: Challenge[];
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

	constructor(
		private jwtService: JwtService,
		private gameService: GamesService,
		private userService: UsersService
	) {
		this.pendingChallenges_ = [];
		this.log = new Logger();
	}

	@WebSocketServer()
	server: Namespace;

	afterInit(server) {}

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
			//this.server.socketsJoin()
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

	@SubscribeMessage('challenge')
	onChallenge(
		@ConnectedSocket() client: Socket,
		@MessageBody() opponentId: number
	) {
		const challengerId: number = client.data.user.id;
		this.log.verbose(challengerId + ' challenges ' + opponentId);
		if (challengerId == opponentId) {
			this.log.warn(
				`${challengerId} challenges self. That would be overly suicidal`
			);
			return;
		}
		//Don't accept dupplicate challenges
		for (const challenge of this.pendingChallenges_) {
			if (
				challenge.hasPlayer(challengerId) &&
				challenge.hasPlayer(opponentId) &&
				!challenge.expired()
			) {
				//TODO emit back an already emitted challenge feedback.
				this.log.warn(
					`${challengerId} vs ${opponentId} or ${opponentId} vs ${challengerId} already exists.`
				);
				return;
			}
		}

		this.pendingChallenges_.push(
			new Challenge(challengerId, opponentId, 15000)
		);
		//this.server.to(opponentId.toString()).emit('beChallenged', challengerId);
		//TODO I think it is cleaner to join clients with the same id to the same room instead of looping.
		this.server.sockets.forEach((socket) => {
			if (socket.data.user.id === opponentId) {
				socket.emit('beChallenged', challengerId);
			}
		});
	}

	@SubscribeMessage('challengeResponse')
	onChallengeResponse(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		response: {
			accept: boolean;
			opponentId: number;
		}
	): void {
		const responseId: number = client.data.user.id;
		const challengerId: number = response.opponentId;
		//Remove the challenger from my list of challengers.
		const challengeIdx = this.pendingChallenges_.findIndex((e) => {
			return (
				e.challengedId === responseId &&
				e.challengerId === challengerId &&
				!e.expired()
			);
		});
		if (challengeIdx === -1) {
			this.log.warn(
				`Response from ${responseId} to non-existing challenge ${challengerId} vs ${responseId}`
			);
			return;
		}
		this.pendingChallenges_.slice(challengeIdx, 1);
		//Create match on an accept.
		if (response.accept) {
			console.log('Challenge accepted.');
			const p1 = this.userService.find(challengerId);
			const p2 = this.userService.find(responseId);
			this.gameService.createMatch({ players: [p1, p2] });
		}
	}

	@Interval(500)
	removeExpiredChallenges() {
		//Challenges are pushed oredered in time, older first.
		while (
			this.pendingChallenges_.length > 0 &&
			this.pendingChallenges_[0].expired()
		) {
			this.pendingChallenges_.splice(0, 1);
		}
	}
}
