import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { QueuePlayer } from './classes/queue-player';
import { GamesGateway } from './games.gateway';
import { ApiService } from '../api/api.service';
import { User } from '../api/orm.entity';

@Injectable()
export class MatchMakingService {
	public constructor(
		@Inject(forwardRef(() => GamesGateway))
		private gateway: GamesGateway,
		private apiService: ApiService
	) {
		this.queuedPlayers = [];

		setInterval(() => {
			this.tick();
		}, 1000);
	}

	public joinQueue(login: string): boolean {
		console.log(
			'Player queue size: ' + this.queuedPlayers.length,
			' joined: ',
			login
		);
		//FIXME find type const user:Observable<User|null> = this.apiService.findOneUserById(login)
		//const user:any = "none"
		this.apiService.findOneUserById(login).subscribe((user: User | null) => {
			console.log('Obsérvame ésta: ', user);
			if (user === null) {
				console.log('User shoud not be null at this point');
				return false;
			}
			const queuedPlayer = new QueuePlayer(login, user.Rating);
			const joiningPlayer = (player: QueuePlayer): boolean => {
				return player.token == queuedPlayer.token;
			};
			if (this.queuedPlayers.find(joiningPlayer) != undefined) return false;
			this.queuedPlayers.push(queuedPlayer);
			return true;
		});
		//TODO return values are broken now, yay FIXME
		return false;
		/*
		if (user === null){
			console.log("User shoud not be null at this point")
			return false
		} else {
			console.log(user)
		}
		*/
		//console.log(this.apiService.findOneUserById(login))
	}

	public leaveQueue(player: string): void {
		const leavingPlayer = (queuedPlayer: QueuePlayer): boolean => {
			return player == queuedPlayer.token;
		};
		const index = this.queuedPlayers.findIndex(leavingPlayer);
		if (index == -1) {
			console.log('Player not in queue: ', player); //TODO use a LOGGER
			return;
		}
		this.queuedPlayers.splice(index, 1);
	}

	private queuedPlayers: Array<QueuePlayer>;

	private tick(): void {
		//Debug info
		for (
			let iPlayer: number = 0;
			iPlayer < this.queuedPlayers.length;
			iPlayer++
		)
			console.log('>', this.queuedPlayers[iPlayer]);

		const checkDate: number = Date.now();
		const compareMax: number = this.queuedPlayers.length - 1;
		for (let iPlayer: number = 0; iPlayer < compareMax; iPlayer++) {
			let lhs: QueuePlayer = this.queuedPlayers[iPlayer];
			if (lhs.matchedWith !== undefined) continue;
			//Will be a shallow copy
			let candidates: Array<QueuePlayer> = [];
			const lhsRange: [number, number] = lhs.ratingRange(checkDate);
			for (
				let jPlayer: number = iPlayer + 1;
				jPlayer <= compareMax;
				jPlayer++
			) {
				let rhs: QueuePlayer = this.queuedPlayers[jPlayer];
				console.log(
					checkDate,
					'] Matching: ',
					lhs.token,
					'|',
					lhs.rating,
					' vs',
					rhs.token,
					'|',
					rhs.rating
				);
				if (rhs.matchedWith !== undefined) continue;
				//Compare lhs with rhs.
				const rhsRange: [number, number] = rhs.ratingRange(checkDate);
				console.log(lhs.token, ": ", lhsRange)
				console.log(rhs.token, ": ", rhsRange)
				if (rhsRange[1] >= lhsRange[0] && rhsRange[0] <= lhsRange[1])
					candidates.push(rhs);
				/*
				if (rhsRange[0] <= lhsRange[0]) {
					if (rhsRange[1] >= lhsRange[0]) candidates.push(rhs);
				} else {
					if (rhsRange[1] <= lhsRange[0]) candidates.push(rhs);
				}
				*/
			}
			//Work with any non-empty candidate array.
			if (candidates.length == 0) continue;
			candidates.sort((rateA: QueuePlayer, rateB: QueuePlayer): number => {
				return (
					Math.abs(rateA.rating - lhs.rating) -
					Math.abs(rateB.rating - lhs.rating)
				);
			});
			lhs.matchedWith = candidates[0].token;
			candidates[0].matchedWith = lhs.token;
			console.log("IT'S A MATCH!!!!");
			this.gateway.notifyNewMatch(lhs.token, candidates[0].token, true);
			//TODO Emit the events, or, let the gameServer create the events
		}

		//TODO
		//PURGE ALL THE THINGS (move to other functions)
		this.queuedPlayers.sort(
			(rateA: QueuePlayer, rateB: QueuePlayer): number => {
				if (rateA.matchedWith === undefined && rateB.matchedWith !== undefined)
					return -1;
				else if (
					rateA.matchedWith !== undefined &&
					rateB.matchedWith === undefined
				)
					return 1;
				return 0;
			}
		);
		while (
			this.queuedPlayers.length > 0 &&
			this.queuedPlayers[this.queuedPlayers.length - 1].matchedWith !==
				undefined
		)
			this.queuedPlayers.pop();
	}
}
