import { Injectable, Logger } from '@nestjs/common';
import { Match } from './classes/match';
import { ApiService } from '../api/api.service';
import { User, Match as MatchDto } from '../api/orm.entity';
import { QueuePlayer } from './classes/queue-player';
import { firstValueFrom } from 'rxjs';
//import { User, Friend, Channels, Match, Subscription } from './orm.entity';

//FIXME ÑAPA (?)
import { Server } from 'socket.io';
//
@Injectable()
export class OngoingGamesService {
	public constructor(private apiService: ApiService) {
		this.games_ = new Map<string, Match>();
		this.logger = new Logger('Ongoing Games');
		this.logger.log('Ongoing Games initialized');
		//FIXME I moved this to the GateWay
		//		setInterval(() => { this.tick(); }, 250);//TODO set tickDelay as evironment?
	}

	get games(): Map<string, Match> {
		return this.games_;
	}

	get gamesCpy(): Map<string, Match> {
		return new Map(this.games_);
	}

	public newMatch(matchKey: string, players: [string, string]): void {
		this.games.set(matchKey, new Match(players));
		this.logger.verbose(`New game: game ${matchKey}`);
	}

	public matchIsWatchable(matchKey: string): boolean {
		this.logger.verbose(
			`Queried match: ${matchKey}-Watchable ${this.games.has(matchKey)}`
		);
		return this.games.has(matchKey);
	}

	public getMatchOf(player: string): string | undefined {
		for (let [key, match] of this.games) {
			if (match.playing(player)) return key;
		}
		return undefined;
	}

	public update(
		gateway: Server,
		matchKey: string,
		player: string,
		actions: number
	): void {
		let match: Match | undefined = this.games.get(matchKey);
		this.logger.verbose(`Game update: game ${matchKey} request`);
		if (match === undefined) {
			this.logger.warn(`Game update: game ${matchKey} does not exist`);
			return;
		} else if (!match.playing(player)) {
			this.logger.warn(`Game update: player ${player} not in game ${matchKey}`);
			return;
		}
		//FIXME ÑAPA
		if (actions == 0) match.playerInput(player, 0.5);
		else if (actions == 1) match.playerInput(player, -0.5);
		else
			this.logger.warn(
				`Invalid action '${actions}' in ${matchKey} by ${player}`
			);
		//FIXME ÑAPA END
		//FIXME ÑAPA
		this.games.forEach((match, key) => {
			this.logger.verbose(`Game update to ${key}`);
			gateway.to(key).emit('gameUpdate', match.status());
		});
		//FIXME ÑAPA END
	}

	public tick(gateway: Server): void {
		this.games.forEach((match, key) => {
			//this.logger.verbose(`Game tick: ${key}`)
			const updateEvent: number = match.gameTick();
			gateway.to(key).emit('gameUpdate', match.status());
			{
				let winner: string;
				let loser: string;
				switch (updateEvent) {
					default: {
						this.logger.warn(`Unhandled match ${key} event '${updateEvent}'`);
						return;
					}
					case 0: {
						return;
					}
					case -1: {
						winner = match.players[0].id;
						loser = match.players[1].id;
						break;
					}
					case -2: {
						loser = match.players[0].id;
						winner = match.players[1].id;
						break;
					}
				}
				//TODO really, this should go somewhere else, private function
				//let u1:User|null = null;
				//let u2:User|null = null;
				//FIXME shouldn't I use User|null here and do the appropriate checks????
				//this.apiService.findOneUserById(match.players[0].id).subscribe( (user:User|null) => {
				//	if (user === null)
				//		return
				//	u1 = {...user};
				//	console.log(u1)
				//});
				//this.apiService.findOneUserById(match.players[1].id).subscribe( (user:User|null) => {
				//	if (user === null)
				//		return
				//	u2 = {...user};
				//});

				//TODO emit to spectators as well. But only them.
				//const eloChange:number = QueuePlayer.ratingIncrease(u1.Rating, u2.Rating);
				//this.logger.error(`Winner: ${winner} earned some ELO ${eloChange}`);
				//this.logger.error(`Loser: ${loser} earned some ELO ${-eloChange}`);
				
				
				gateway.to(winner).emit('win');
				gateway.to(loser).emit('lose');
				gateway.to(key).socketsLeave(key);
				this.games.delete(key);
				this.storeMatchResult(winner, loser, match);
			}
		});
	}

	private logger: Logger;
	private games_: Map<string, Match>;

	private async storeMatchResult(winner:string, loser:string, finishedMatch: Match): Promise<void> {
		let winnerUser:User|null = await firstValueFrom(this.apiService.findOneUserById(winner));
		let loserUser:User|null = await firstValueFrom(this.apiService.findOneUserById(loser));
		if (winnerUser === null || loserUser === null)
			return;

		const ratingTransfer:number = QueuePlayer.ratingIncrease(winnerUser.Rating, loserUser.Rating);
		this.logger.verbose(`${winner} earned ${ratingTransfer} rating from ${loser}`);
		winnerUser.Rating+=ratingTransfer;
		loserUser.Rating-=ratingTransfer;
		let matchData: MatchDto = new MatchDto();
		matchData.date = new Date().toISOString();
		matchData.user1 = finishedMatch.players[0].id;
		matchData.user2 = finishedMatch.players[1].id;
		matchData.result = finishedMatch.score.toString().replace(',', '-');
		matchData.mode = 0;
		this.logger.debug(
			`Tick: Sent match ${matchData} update post request to DB`
		);
		this.apiService.updateUser(winner, winnerUser);
		this.apiService.updateUser(loser, loserUser);
		this.apiService.createMatch(matchData);
	}
}
