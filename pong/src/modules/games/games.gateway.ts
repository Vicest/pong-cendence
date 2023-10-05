import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect
} from '@nestjs/websockets'
import { Logger } from '@nestjs/common'
import { OngoingGamesService } from './ongoing-games.service'
import { Server, Socket } from 'socket.io'

type SocketId = string;

//FIXME Ad-Hoc
type duelRequest = {
	challenger: string,
	opponent: string,
};

@WebSocketGateway({ cors: true })
export class GamesGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	private server: Server;
	private logger: Logger;
	//TODO Do I use matchString somewhere?
	private matchString: string;
	private sessions: Set<string>;

	public constructor(private ogs: OngoingGamesService) {
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
		this.logger.debug('Socket connected: ' + socket.id + ' is ' + socket.handshake.auth.token)
		//TODO Handle same auth sockets.
		this.sessions.add(socket.handshake.auth.token)
		socket.join(socket.handshake.auth.token)
	}

	handleDisconnect(socket: Socket) {
		this.logger.debug('Socket disconnected: ' + socket.id + ' was ' + socket.handshake.auth.token)
		//TODO Handle ongoing game disconnection.
	}

	/*
		 //FIXME: Debug messages sort of lie and variable names are a bbit confusing
		When a user (socket) challenges another user (uuid) it gets registered in
		a room uuid+'challengers', this is an off-gateway, in-server, register of
		challenges the opponent is recieving.
		The uuid, opponent, gets notified of the challenge. A reply is expected.
	*/
	@SubscribeMessage('challenge')
	onChallenge(@ConnectedSocket() socket: Socket,
						 @MessageBody() opponentUUID: string): void {
		//TODO Maybe do some checks to who can and can not be challenged
		const challengerUUID:string = socket.handshake.auth.token;
		this.logger.verbose(opponentUUID + ' challenges ' + challengerUUID)
		if (challengerUUID == opponentUUID) {
			this.logger.warn(challengerUUID + ' challenges self. That would be overly suicidal')
			return
		}
		//TODO better way to inspect ongoing challenges
		this.logger.verbose(opponentUUID + 'joins ' + opponentUUID + 'challengers')
		//TODO rethink the room name? This belongs outside of the gateway?
		socket.join(opponentUUID + 'challengers')
		this.logger.verbose(opponentUUID + ' sends beChallenged ' + challengerUUID)
		this.server.to(opponentUUID).emit('beChallenged', challengerUUID)
	}

	/*
		When a user replies to a challenge, said user is removed as a challenger.
		On an accept a new match and room gets created.
	*/
	@SubscribeMessage('challengeResponse')
	onChallengeResponse(@ConnectedSocket() socket: Socket,
											@MessageBody() response: {
												accept: boolean,
												opponent: string
											}): void {
		const challengerUUID:string = socket.handshake.auth.token
		const opponentUUID:string = response.opponent
		//Remove the challenger from my list of challengers.
		//Create match on an accept.
		//FIXME Check that the opponent actually got challenged, maybe subscribe to message once or somesuch
		this.logger.verbose(challengerUUID + ' got response from ' + opponentUUID + ': ' + response.accept)
		this.server.in(opponentUUID).socketsLeave(challengerUUID + 'challengers')
		if (response.accept) {
			const roomId:string = opponentUUID + challengerUUID + 'match'
			this.server.to(opponentUUID).socketsJoin(roomId)
			this.server.to(challengerUUID).socketsJoin(roomId)
			this.logger.verbose('Games gateway sends roomId: ' + roomId)
			this.server.to(roomId).emit('roomId', roomId)
			//TODO update to have the gameserver handle the ids?
			this.ogs.newMatch(roomId, [challengerUUID, opponentUUID])
			this.logger.log('Started match: ' + roomId)
		}
	}

	@SubscribeMessage('playerMoves')
	onPlayerMoves(@MessageBody() data: {
		player:string,
		match:string,
		actions:number //TODO Actions could be more/different
	}): void {
		//TODO(?) Shall the gateway be the one to emit?
		this.ogs.update(this.server, data.match, data.player, data.actions);
	}

	@SubscribeMessage('watch')
	onWatch(@ConnectedSocket() socket: Socket,
					@MessageBody() data: {
						targetType:string,
						targetString:string,
					}):void {
		let matchKey:string | undefined = undefined;
		switch (data.targetType) {
			default: {
				this.logger.warn(`Games gateway: watch unknown target ${data.targetType}`)
				return
			} case 'user': {
				//TODO check if user exists?
				matchKey = this.ogs.getMatchOf(data.targetString)
				if (matchKey === undefined) {
					this.logger.warn(`Games gateway: watch player ${data.targetString} not in a game`)
					return
				}
				break
			} case 'match': {//TODO FILL
				//TODO Shall I consider filtering people spectating themselves...?
				if (!this.ogs.matchIsWatchable(data.targetString)) {
					this.logger.warn(`Games gateway: watch match ${data.targetString} does not exsist`)
					return
				}
				matchKey = data.targetString
				break
			}
		}
		//TODO Join only on socket or the whole session?
//		const spectatorUUID:string = socket.handshake.auth.token
//		this.server.to(spectatorUUID).join(matchKey)
		socket.join(matchKey)
	}

	@SubscribeMessage('stopWatching')
	onStopWatching(@ConnectedSocket() socket:Socket, @MessageBody() targetString:string): void {
		const spectatorUUID:string = socket.handshake.auth.token
		if (!socket.rooms.has(targetString))
			this.logger.warn(`Games gateway: stop watching ${spectatorUUID} on ${socket.id} is not watching ${targetString}`)
		socket.leave(targetString)
	}
}
