import { Injectable } from '@nestjs/common'
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

	public leaveQueue(player: string): void {
		const leavingPlayer = (queuedPlayer: QueuePlayer): boolean => {
			return player == queuedPlayer.token;
		}
		const index = this.queuedPlayers.findIndex(leavingPlayer)
		if (index == -1) {
			console.log("Player not in queue: ", player)//TODO use a LOGGER
			return
		}
		this.queuedPlayers.splice(index ,1)
	}

	private queuedPlayers: Array<QueuePlayer>

	private tick():void {
		for (let iPlayer:number = 0; iPlayer < this.queuedPlayers.length; iPlayer++)
			console.log(">", this.queuedPlayers[iPlayer])

		const checkDate:number = Date.now()
		for (let iPlayer:number = 0; iPlayer + 1 < this.queuedPlayers.length; iPlayer++) {
			let lhs:QueuePlayer = this.queuedPlayers[iPlayer]
			if (lhs.matchedWith !== undefined)
				continue

			const lhsRange:[number, number] = lhs.ratingRange(checkDate)
			//Filter creates a shallow copy.
			let candidates:Array<QueuePlayer> =
				this.queuedPlayers.filter((rhs:QueuePlayer) => {
				if (rhs.matchedWith !== undefined || lhs === rhs)
					return false
				//Compare lhs with rhs.
				const rhsRange:[number, number] = rhs.ratingRange(checkDate)
				if (rhsRange[0] <= lhsRange[0]) {
					return rhsRange[1] >= lhsRange[0]
				} else {
					return rhsRange[1] <= lhsRange[0]
				}
			})
			//Work with any non-empty candidate array.
			if (candidates.length == 0)
				continue
			candidates.sort(
				(rateA:QueuePlayer, rateB:QueuePlayer):number => 
				{return Math.abs(rateA.rating - lhs.rating) - Math.abs(rateB.rating - lhs.rating)}
			)
			candidates[0].matchedWith = lhs.token
			lhs.matchedWith = candidates[0].token
			console.log("IT'S A MATCH!!!!")
			//TODO Emit the events, or, let the gameServer create the events
		}

		//TODO
		//PURGE ALL THE THINGS (move to other functions)
		this.queuedPlayers.sort(
			(rateA:QueuePlayer, rateB:QueuePlayer):number => {
				if (rateA.matchedWith === undefined && rateB.matchedWith !== undefined)
					return -1
				else if (rateA.matchedWith !== undefined && rateB.matchedWith === undefined)
					return 1
				return 0
			}
		)
		while (this.queuedPlayers.length > 0 && this.queuedPlayers[this.queuedPlayers.length-1].matchedWith !== undefined)
			this.queuedPlayers.pop()
	}
}
