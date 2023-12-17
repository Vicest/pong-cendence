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
			this.log.debug(
				`${decoded.login} connected in room ${decoded.id}`,
				this.constructor.name
			);
			client.join(decoded.id.toString());
		} catch (error) {
			this.log.warn(`Error on connect: ${error}`);
			client.disconnect();
		}
	}

	handleDisconnect(@ConnectedSocket() client: Socket) {
		try {
			const decoded = this.jwtService.verify(client.handshake.auth.token);
			client.data.user = decoded;
			this.log.debug(`${decoded.login} disconnected`, this.constructor.name);
			client.leave(decoded.id.toString());
		} catch (error) {
			this.log.error(`Error on disconnect: ${error}`);
			client.disconnect();
		}
	}

	@SubscribeMessage('challenge')
	onChallenge(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		data: {
			opponentId: number;
			gameId: number;
		}
	) {
		const challengerId: number = client.data.user.id;
		this.log.verbose(challengerId + ' challenges ' + data.opponentId);
		if (challengerId == data.opponentId) {
			this.log.warn(
				`${challengerId} challenges self. That would be overly suicidal`
			);
			return;
		}
		//Don't accept dupplicate challenges
		for (const challenge of this.pendingChallenges_) {
			if (
				challenge.hasPlayer(challengerId) &&
				challenge.hasPlayer(data.opponentId) &&
				!challenge.expired()
			) {
				//TODO emit back an already emitted challenge feedback.
				this.server
					.to(challengerId.toString())
					.emit('challengeExists', { challenger: challengerId });
				this.log.warn(
					`${challengerId} vs ${data.opponentId} or ${data.opponentId} vs ${challengerId} already exists.`
				);
				return;
			}
		}

		this.pendingChallenges_.push(
			new Challenge(data.gameId, challengerId, data.opponentId, 15000)
		);
		//this.server.to(data.opponentId.toString()).emit('beChallenged', challengerId);
		//TODO I think it is cleaner to join clients with the same id to the same room instead of looping.
		console.log(`Send beChallenged emmitted to: ${data.opponentId.toString()}`);
		this.server
			.to(data.opponentId.toString())
			.emit('beChallenged', challengerId);
	}

	@SubscribeMessage('challengeResponse')
	async onChallengeResponse(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		response: {
			accept: boolean;
			opponentId: number;
		}
	): Promise<void> {
		const responseId: number = client.data.user.id;
		const challengerId: number = response.opponentId;
		let challenge: Challenge = this.pendingChallenges_.find((e) => {
			return (
				e.challengedId === responseId &&
				e.challengerId === challengerId &&
				!e.expired()
			);
		});
		if (challenge) this.deleteChallenge(challenge);
		else {
			this.log.warn(
				`Response from ${responseId} to non-existing challenge ${challengerId} vs ${responseId}`
			);
			return;
		}
		console.log('Challenge response received.', response.accept);
		//Create match on an accept.
		if (response.accept) {
			const p1 = await this.userService.find(challengerId);
			const p2 = await this.userService.find(responseId);
			//TODO Add socket emit?? to listener
			const pong = await this.gameService.findGameByName('pong'); //Definitely not a hardcode because we are short on time
			console.log(`Find gamebyid: ${JSON.stringify(pong)}`);
			await this.gameService.createMatch({
				game: pong,
				players: [p1, p2]
			});
		}
	}

	deleteChallenge(challenge: Challenge) {
		const challengeIdx = this.pendingChallenges_.findIndex(
			(e) => e.id === challenge.id
		);
		console.log(`Deleting challenge ${challenge.id} at index ${challengeIdx}`);
		console.log(`sending challengeDeleted to ${challenge.challengedId}`);
		this.server
			.to([
				challenge.challengedId.toString(),
				challenge.challengerId.toString()
			])
			.emit('challengeDeleted', challenge.id);
		this.pendingChallenges_.splice(challengeIdx, 1);
	}

	@Interval(500)
	removeExpiredChallenges() {
		//this.log.verbose(`Current challenges: ${JSON.stringify(this.pendingChallenges_)}`);
		//Challenges are pushed oredered in time, older first.

		let expiredChallenges = this.pendingChallenges_.filter((e) => {
			console.log(`Checking challenge ${e.id} for expiration`);
			return e.expired();
		});
		for (const challenge of expiredChallenges) {
			this.deleteChallenge(challenge);
		}
	}
}
