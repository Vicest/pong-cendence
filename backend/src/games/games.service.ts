import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { UsersService } from '../users/users.service';
import { Match } from './match';
import { QueuePlayer } from './queue-player';

@Injectable()
export class GamesService {
	public constructor(private usersService: UsersService) {
        this.games_ = [];
        this.queuedPlayers_ = [];
        this.logger = new Logger('Ongoing Games');
        this.logger.log('Ongoing Games initialized');
    }

    get games(): Match[] {
        return this.games_;
    }

    public game(id: Number): Match {
        //return this.games_.find(id); TODO
        return this.games_[0];
    }

	public async joinQueue(id: number): Promise<boolean> {
		this.logger.verbose(`ID: ${id} joins queue.`);

		const joiningPlayer = await this.usersService.find(id);
		if (joiningPlayer === null) {
            this.logger.warn(`ID: ${id} requested joining queue but not found in DB.`);
			return false;
		}

		const queuedPlayer = new QueuePlayer(id, 123/*TODO joiningPlayer.Rating*/);
		if (
			this.queuedPlayers_.find((player: QueuePlayer): boolean => {
				return player.id == queuedPlayer.id;
			}) != undefined
		) {
            this.logger.warn(`ID: ${id} requested joining queue but it is already in it.`);
			return false;
		}
		this.queuedPlayers_.push(queuedPlayer);
		return true;
	}

	public leaveQueue(id: number): void {
		const leavingPlayer = (queuedPlayer) => { id == queuedPlayer.id };
		const index = this.queuedPlayers_.findIndex(leavingPlayer);
		if (index == -1) {
			//TODO use a LOGGER
			return this.logger.warn('Player not in queue: ', id);
		}
		this.queuedPlayers_.splice(index, 1);
	}

    //Privates
	private logger: Logger;
	private games_: Match[];
	private queuedPlayers_: QueuePlayer[];

	private createGame(leftPlayer, rightPlayer, {}) {
		this.games_.push(new Match([leftPlayer.id, rightPlayer.id]));
	}

	@Interval(1000)//TODO tick_rate in env
    private matchMakingTick(): void {
		this.logger.debug(JSON.stringify(this.queuedPlayers_))

		const checkDate: number = Date.now();
		const compareMax: number = this.queuedPlayers_.length - 1;
		for (let iPlayer: number = 0; iPlayer < compareMax; iPlayer++) {
			let lhs: QueuePlayer = this.queuedPlayers_[iPlayer];
			if (lhs.matchedWith !== undefined) continue;
			//Will be a shallow copy
			let candidates: Array<QueuePlayer> = [];
			const lhsRange: [number, number] = lhs.ratingRange(checkDate);
			for (let jPlayer: number = iPlayer + 1; jPlayer <= compareMax; jPlayer++) {
				let rhs: QueuePlayer = this.queuedPlayers_[jPlayer];
				if (rhs.matchedWith !== undefined) continue;
				
				//Compare lhs with rhs.
				const rhsRange: [number, number] = rhs.ratingRange(checkDate);
				if (rhsRange[1] >= lhsRange[0] && rhsRange[0] <= lhsRange[1])
					candidates.push(rhs);
			}

			//Work with any non-empty candidate array.
			if (candidates.length == 0) continue;

			candidates.sort((rateA: QueuePlayer, rateB: QueuePlayer): number => {
				return (
					Math.abs(rateA.rating - lhs.rating) -
					Math.abs(rateB.rating - lhs.rating)
				);
			});

			lhs.matchedWith = candidates[0].id;
			candidates[0].matchedWith = lhs.id;
			//TODO use a LOGGER
			console.log(`IT'S A MATCH!!!! ${lhs.id} vs ${candidates[0].id}`);
			// TODO this.gateway.notifyNewMatch(lhs.token, candidates[0].token, true);
			//this.leaveQueue(lhs.token);
			//this.leaveQueue(candidates[0].token);
		}

		//this.queuedPlayers = this.queuedPlayers.filter( (qp:QueuePlayer):boolean => {
		//	return qp.matchedWith === undefined;
		//} )
		//console.log("AFT: ", this.queuedPlayers)
		//this.queuedPlayers = [...aux];
		//console.log("AUX:",aux);
		//console.log("QUE:",this.queuedPlayers);
		//TODO
		//PURGE ALL THE THINGS (move to other functions)
		this.queuedPlayers_.sort(
			(rateA: QueuePlayer, rateB: QueuePlayer): number => {
				if (rateA.matchedWith === undefined && rateB.matchedWith !== undefined)
					return -1;
				else if (rateA.matchedWith !== undefined && rateB.matchedWith === undefined)
					return 1;
				return 0;
			}
		);
		while (
			this.queuedPlayers_.length > 0 &&
			this.queuedPlayers_[this.queuedPlayers_.length - 1].matchedWith !==
				undefined
		)
			this.queuedPlayers_.pop();
    }
}
