import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect
} from '@nestjs/websockets';
import { Logger, Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { OngoingGamesService } from './ongoing-games.service';
import { MatchMakingService } from './match-making.service';

@Injectable()
@WebSocketGateway({ cors: true }) //TODO use our own origin only
export class GamesGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	private server: Server;
	private logger: Logger;
	//TODO Do I use matchString somewhere?
	private sessions: Set<string>;

	public constructor(
		private ogs: OngoingGamesService,
		private readonly mms: MatchMakingService
	) {
		this.sessions = new Set<string>();
		this.logger = new Logger('Games Gateway');
		//FIXME ÑAPA para que el GW emita los matches
		setInterval(() => {
			this.ogs.tick(this.server);
		}, 250);
		//FIXME END
		this.logger.log('Games Gateway initialized');
	}

	handleConnection(socket: Socket) {
		//TODO Middleware was blocking most connections
		//Rethink/Redo it
		//socket.use(([event, ...args], next) => {
		//	if (!socket.handshake.headers['login'])
		//		{console.log("Warded")
		//		return next(new Error("Login not provided"))
		//	}
		//	console.log("Pass")
		//	return next()
		//})
		//
		this.logger.debug(
			'Socket connected: ' + socket.id + ' is ' + socket.handshake.auth.login
		);
		//TODO Handle same auth sockets.
		this.sessions.add(socket.handshake.auth.login);
		socket.join(socket.handshake.auth.login);
	}

	handleDisconnect(socket: Socket) {
		this.logger.debug(
			'Socket disconnected: ' +
				socket.id +
				' was ' +
				socket.handshake.auth.login
		);
		//TODO Handle ongoing game disconnection.
	}

	@SubscribeMessage('ping')
	onPing(@ConnectedSocket() socket: Socket): void {
		this.logger.verbose('Pinged from: ', socket.handshake.auth.login);
	}

	/*
		//FIXME: Debug messages sort of lie and variable names are a bbit confusing
		When a user (socket) challenges another user (Login) it gets registered in
		a room Login+'challengers', this is an off-gateway, in-server, register of
		challenges the opponent is recieving.
		The Login, opponent, gets notified of the challenge. A reply is expected.
	*/
	@SubscribeMessage('challenge')
	onChallenge(
		@ConnectedSocket() socket: Socket,
		@MessageBody() opponentLogin: string
	): void {
		//TODO Maybe do some checks to who can and can not be challenged
		const challengerLogin: string = socket.handshake.auth.login;
		this.logger.verbose(opponentLogin + ' challenges ' + challengerLogin);
		if (challengerLogin == opponentLogin) {
			this.logger.warn(
				`${challengerLogin} challenges self. That would be overly suicidal`
			);
			return;
		}
		//TODO better way to inspect ongoing challenges
		this.logger.verbose(
			`${challengerLogin} joins ${opponentLogin} challengers`
		);
		//TODO rethink the room name? This belongs outside of the gateway?
		socket.join(opponentLogin + 'challengers');
		this.logger.verbose(
			opponentLogin + ' sends beChallenged ' + challengerLogin
		);
		this.server.to(opponentLogin).emit('beChallenged', challengerLogin);
	}

	/*
		When a user replies to a challenge, said user is removed as a challenger.
		On an accept a new match and room gets created.
	*/
	@SubscribeMessage('challengeResponse')
	onChallengeResponse(
		@ConnectedSocket() socket: Socket,
		@MessageBody()
		response: {
			accept: boolean;
			opponent: string;
		}
	): void {
		const challengerLogin: string = socket.handshake.auth.login;
		const opponentLogin: string = response.opponent;
		//Remove the challenger from my list of challengers.
		//Create match on an accept.
		//FIXME Check that the opponent actually got challenged, maybe subscribe to message once or somesuch
		this.logger.verbose(
			challengerLogin +
				' got response from ' +
				opponentLogin +
				': ' +
				response.accept
		);
		this.server.in(opponentLogin).socketsLeave(challengerLogin + 'challengers');
		if (response.accept) {
			const roomId: string = opponentLogin + challengerLogin + 'match';
			this.server.to(opponentLogin).socketsJoin(roomId);
			this.server.to(challengerLogin).socketsJoin(roomId);
			this.logger.verbose('Games gateway sends roomId: ' + roomId);
			this.server.to(roomId).emit('roomId', roomId);
			//TODO update to have the gameserver handle the ids?
			this.ogs.newMatch(roomId, [challengerLogin, opponentLogin]);
			this.logger.log('Started match: ' + roomId);
		}
	}

	@SubscribeMessage('playerMoves')
	onPlayerMoves(
		@ConnectedSocket() socket: Socket,
		@MessageBody()
		data: {
			match: string;
			actions: number; //TODO Actions could be more/different
		}
	): void {
		//TODO(?) Shall the gateway be the one to emit?
		this.ogs.update(
			this.server,
			data.match,
			socket.handshake.auth.login,
			data.actions
		);
	}

	@SubscribeMessage('watch')
	onWatch(
		@ConnectedSocket() socket: Socket,
		@MessageBody()
		data: {
			targetType: string;
			targetString: string;
		}
	): void {
		let matchKey: string | undefined = undefined;
		switch (data.targetType) {
			default: {
				this.logger.warn(
					`Games gateway: watch unknown target ${data.targetType}`
				);
				return;
			}
			case 'user': {
				//TODO check if user exists?
				matchKey = this.ogs.getMatchOf(data.targetString);
				if (matchKey === undefined) {
					this.logger.warn(
						`Games gateway: watch player ${data.targetString} not in a game`
					);
					return;
				}
				break;
			}
			case 'match': {
				//TODO FILL
				//TODO Shall I consider filtering people spectating themselves...?
				if (!this.ogs.matchIsWatchable(data.targetString)) {
					this.logger.warn(
						`Games gateway: watch match ${data.targetString} does not exsist`
					);
					return;
				}
				matchKey = data.targetString;
				break;
			}
		}
		//TODO Join only on socket or the whole session?
		//		const spectatorLogin:string = socket.handshake.auth.token
		//		this.server.to(spectatorLogin).join(matchKey)
		socket.join(matchKey);
	}

	@SubscribeMessage('stopWatching')
	onStopWatching(
		@ConnectedSocket() socket: Socket,
		@MessageBody() targetString: string
	): void {
		const spectatorLogin: string = socket.handshake.auth.token;
		if (!socket.rooms.has(targetString))
			this.logger.warn(
				`Games gateway: stop watching ${spectatorLogin} on ${socket.id} is not watching ${targetString}`
			);
		socket.leave(targetString);
	}

	//Queueing
	@SubscribeMessage('queue')
	async onQueue(@MessageBody() login: string): Promise<void> {
		//this.logger.debug('Queue called with: ', temp_reqs)
		//TODO
		//Validate the request comes from the user with the right auth?
		//console.log(/*"Queuing: ", auth, */"BODY: ", temp_reqs)
		//Temp req come from the session service(ss)
		//user = ss.usernameOf(auth)
		//And from the database
		//rating = ss.ratingOf(user)
		//Maybe a single query to DB for the whole user info?
		//TODO is this some sort of middleware
		//if (login === undefined) {
		//	this.logger.warn('Queue called with undefined values: ', temp_reqs)
		//	return
		//}
		//FIXME the parseInt part should probably be in a middleware
		//ALSO pass the values to the service and let the service builld tha class?
		//if (this.mms.joinQueue(new QueuePlayer(temp_reqs.login, parseInt(temp_reqs.rating)))) {
		if (await this.mms.joinQueue(login)) {
			this.logger.verbose('OK!');
		} else {
			this.logger.debug('already in queue :(!');
		}
	}

	public notifyNewMatch(login1: string, login2: string, isRanked: boolean) {
		const roomId: string = login1 + 'vs' + login2;
		this.server.to(login1).socketsJoin(roomId);
		this.server.to(login2).socketsJoin(roomId);
		this.logger.verbose('Games gateway sends roomId: ' + roomId);
		this.server.to(roomId).emit('roomId', roomId);
		//TODO update to have the gameserver handle the ids?
		this.ogs.newMatch(roomId, [login1, login2]);
		this.logger.log('Started match: ' + roomId);
	}
	//	@SubscribeMessage('leaveQueue')
	//	onLeaveQueue(@Headers('Authorization') auth:string, @Body() temp_reqs:string): void {
	//		console.log("Leaving: ", auth)
	//		this.mms.leaveQueue(temp_reqs);
	//		//TODO
	//
	//	}
}
