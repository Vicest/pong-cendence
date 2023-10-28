import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
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

	public async joinQueue(login: string): Promise<boolean> {
		//TODO use a logger
		console.log(`Queue size: ${this.queuedPlayers.length}, joined: ${login}`);

		const joiningPlayer: User | null = await firstValueFrom(
			this.apiService.findOneUserById(login)
		);
		if (joiningPlayer === null) {
			//TODO use a logger
			console.log('User not found in database');
			return false;
		}

		const queuedPlayer = new QueuePlayer(login, joiningPlayer.Rating);
		if (
			this.queuedPlayers.find((player: QueuePlayer): boolean => {
				return player.token == queuedPlayer.token;
			}) != undefined
		) {
			//TODO use a logger
			console.log('User already in queue');
			return false;
		}
		this.queuedPlayers.push(queuedPlayer);
		return true;
	}

	public leaveQueue(player: string): void {
		const leavingPlayer = (queuedPlayer: QueuePlayer): boolean => {
			return player == queuedPlayer.token;
		};
		const index = this.queuedPlayers.findIndex(leavingPlayer);
		if (index == -1) {
			//TODO use a LOGGER
			console.log('Player not in queue: ', player);
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
				//TODO use a LOGGER
				console.log(
					`${checkDate}] Try ${lhs.token}|${lhs.rating} vs ${rhs.token}|${rhs.rating}`
				);
				if (rhs.matchedWith !== undefined) continue;
				//Compare lhs with rhs.
				const rhsRange: [number, number] = rhs.ratingRange(checkDate);
				console.log(lhs.token, ': ', lhsRange);
				console.log(rhs.token, ': ', rhsRange);
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
			lhs.matchedWith = candidates[0].token;
			candidates[0].matchedWith = lhs.token;
			//TODO use a LOGGER
			console.log(`IT'S A MATCH!!!! ${lhs.token} vs ${candidates[0].token}`);
			this.gateway.notifyNewMatch(lhs.token, candidates[0].token, true);
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
