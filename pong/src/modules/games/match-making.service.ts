import { Injectable } from '@nestjs/common';
import { QueuePlayerDto } from './dtos'

@Injectable()
export class MatchMakingService {
	public constructor() {
		this.queuedPlayers = [];
	}

	public joinQueue(queuedPlayer: QueuePlayerDto): boolean {
		console.log("Player queue size: " + this.queuedPlayers.length);
		const joiningPlayer = (player: [QueuePlayerDto,  number]): boolean => {
			return player[0].token == queuedPlayer.token;
		}

		if (this.queuedPlayers.find(joiningPlayer) != undefined)
			return false;
		this.queuedPlayers.push([queuedPlayer, 0]);
		return true;
	}

	private queuedPlayers: Array<[QueuePlayerDto, number]>;
}
