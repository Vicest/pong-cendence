import { Injectable } from '@nestjs/common';
import { QueuePlayer } from './queue-player'

@Injectable()
export class MatchMakingService {
	public constructor() {
		this.queuedPlayers = []

		setInterval(() => {
			this.tick()
		}, 1000)
	}

	public joinQueue(queuedPlayer: QueuePlayer): boolean {
		console.log("Player queue size: " + this.queuedPlayers.length);
		const joiningPlayer = (player: QueuePlayer): boolean => {
			return player.token == queuedPlayer.token;
		}

		if (this.queuedPlayers.find(joiningPlayer) != undefined)
			return false;
		this.queuedPlayers.push(queuedPlayer);
		return true;
	}

	private queuedPlayers: Array<QueuePlayer>

	private tick():void {
		const checkDate:number = Date.now()
		for (let iPlayer:number = 0; iPlayer + 1 < this.queuedPlayers.length; iPlayer++) {
			let lhs:QueuePlayer = this.queuedPlayers[iPlayer]
			if (lhs.matchedWith !== undefined)
				continue

			const lhsRange:[number, number] = lhs.ratingRange(checkDate)
			//Filter creates a shallow copy.
			let candidates:Array<QueuePlayer> =
				this.queuedPlayers.filter((rhs:QueuePlayer) => {
				if (rhs.matchedWith !== undefined)
					return false
				const rhsRange:[number, number] = rhs.ratingRange(checkDate)
				if (rhsRange[0] <= lhsRange[0]) {
					return rhsRange[1] >= lhsRange[0]
				} else {
					return rhsRange[1] <= lhsRange[0]
				}
				//Compare lhs with rhs.
			})
			//Work with any non-empty candidate array.
			//If any candidate found... start from scratch?
			//Inefficient, just mark the player as selected, then filter it out.
		}
	}
}
