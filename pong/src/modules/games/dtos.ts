export class QueuePlayerDto {
	token: string;
	mmr: string;
	mode: string;
}

export class VersusDto {
	player1: string;
	player2: string;
	mode: string;
}

export class MatchResultDto {
	winner: string;
	loser: string;
	score: string;
	mode: string;
}

//TODO define these somewhere else
enum PongActions {
	Up,
	Down
}

export class PlayerMovesDto {
	//	timestamp: number;
	id: string;
	match: string;
	//	match: number;
	direction: number;
}

//export class PlayerMovesDto {
//	timestamp: number;
//	player: string;
//	match: number;
//	moves: Array<PongActions>;
//}
