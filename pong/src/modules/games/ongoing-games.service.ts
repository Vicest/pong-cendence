import { Injectable, Logger } from '@nestjs/common'
import { Match } from './classes/match/match'
import { GamesGateway } from './games.gateway'

//FIXME ÑAPA (?)
import { Server } from 'socket.io'
//
@Injectable()
export class OngoingGamesService {
	public constructor() {
		this.games = new Map<string, Match>()
		this.logger = new Logger('Ongoing Games')
		this.logger.log('Ongoing Games initialized')
//FIXME I moved this to the GateWay
//		setInterval(() => { this.tick(); }, 250);//TODO set tickDelay as evironment?
	}

	public newMatch(matchKey:string, players:[string, string]): void {
		this.games.set(matchKey, new Match(players))
	}

	public matchIsWatchable(matchKey:string):boolean {
		this.logger.verbose(`Queried match: ${matchKey}-Watchable ${this.games.has(matchKey)}`)
		return this.games.has(matchKey)
	}

	public getMatchOf(player:string):string {
		//foreach find the match or retur undefined (maybe use array instead?? TODO
		return ''
	}

	public update(gateway: Server, matchKey: string, player:string, actions: number): void {
		let match:Match | undefined = this.games.get(matchKey)
		if (match === undefined) {
			this.logger.warn(`Game update: game ${matchKey} does not exist`)
			return
		} else if (!match.playing(player)) {
			this.logger.warn(`Game update: player ${player} not in game ${matchKey}`)
			return
		}
		//FIXME ÑAPA
		if (actions == 0)
			match.playerInput(player, 0.5)
		else if (actions == 1)
			match.playerInput(player, -0.5)
		else
			this.logger.warn(`Invalid action '${actions}' in ${matchKey} by ${player}`)
		//FIXME ÑAPA END
		//FIXME ÑAPA
		this.games.forEach((match, key) => {
			gateway.to(key).emit('gameUpdate', match.status())
		})
		//FIXME ÑAPA END
	}

	public tick(gateway: Server): void {
		this.games.forEach((match, key) => {
			let updateEvent:number = match.gameTick()
			gateway.to(key).emit('gameUpdate', match.status())
			//TODO emit to watchers
			{
				let winner:string
				let loser:string
				switch (updateEvent) {
					default: {
						this.logger.warn(`Unhandled match ${key} event '${updateEvent}'`)
						return
					} case 0: {
						return
					} case -1: {
						winner = match.players[0].id
						loser = match.players[1].id
						break
					} case -2: {
						loser = match.players[0].id
						winner = match.players[1].id
						break
					}
				}
				//TODO emit to spectators as well. But only them.
				gateway.to(winner).emit('win');
				gateway.to(loser).emit('lose');
				gateway.to(key).socketsLeave(key);
				this.games.delete(key);
				//TODO send result to DB
			}
		})
	}

	private logger: Logger;
	private games: Map<string, Match>;
}
