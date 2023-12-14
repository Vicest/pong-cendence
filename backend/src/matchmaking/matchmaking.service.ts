import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { QueuePlayer } from './queue-player';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MatchMakingService {
	constructor(private userService: UsersService) {
		this.log = new Logger();
        this.queuedPlayers_ = [];
	}

	public async joinQueue(user: User): Promise<boolean> {
		this.log.verbose(`ID: ${user.id} joins queue.`);

		const joiningPlayer = await this.userService.find(user.id);
		if (joiningPlayer === null) {
            this.log.warn(`ID: ${user.id} requested joining queue but not found in DB.`);
			return false;
		}

		const queuedPlayer = new QueuePlayer(user, 123/*TODO joiningPlayer.Rating*/);
		console.log("The qp: ", queuedPlayer)
		if (
			this.queuedPlayers_.find((player: QueuePlayer): boolean => {
				return player.id == queuedPlayer.id;
			}) != undefined
		) {
            this.log.warn(`ID: ${user.id} requested joining queue but it is already in it.`);
			return false;
		}
		//TODO Check user status. Can't join if not online, not gaming, etc...
		this.queuedPlayers_.push(queuedPlayer);
		return true;
	}

	public leaveQueue(id: number): void {
		this.log.verbose(`ID: ${id} leaves queue.\n ${this.queuedPlayers_}`);
		const leavingPlayer = (queuedPlayer:QueuePlayer) => { return id == queuedPlayer.id };
		const index = this.queuedPlayers_.findIndex(leavingPlayer);
		if (index == -1) {
			//TODO use a LOGGER
			return this.log.warn(`Player not in queue: ${id}`);
		}
		this.queuedPlayers_.splice(index, 1);
	}

	private log: Logger;
	private queuedPlayers_: QueuePlayer[];

	@Interval(1000)//TODO tick_rate in env
    private matchMakingTick(): void {
		//this.log.debug(JSON.stringify(this.queuedPlayers_))
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
			this.log.verbose(`Match found: ${lhs.id} vs ${candidates[0].id}`);
			// TODO this.gamesService.createMatch(...);
			//vvv afterInsert vvv
			this.leaveQueue(lhs.id);
			this.leaveQueue(candidates[0].id);
			//TODO ^^ also change user status as busy. A nivel de match listener^^
		}
    }
}
