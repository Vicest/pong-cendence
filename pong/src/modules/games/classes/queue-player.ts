export class QueuePlayer {
	/*
		In this situation (always one winner, one loser) ELO is symetrical
		therefore: WinnerIncrease == -LoserIncrease
		Basic explanation of the ELO algorithm formulae usage.
		https://metinmediamath.wordpress.com/2013/11/27/how-to-calculate-the-elo-rating-including-example/
	*/
	public static ratingIncrease(
		winnerRating: number,
		loserRating: number
	): number {
		const K: number = 42; //Mind, the K-factor has plenty of variations, let us have fun with THE number
		const winnerPrecomputed: number = Math.pow(10, winnerRating / 400);
		const loserPrecomputed: number = Math.pow(10, loserRating / 400);
		const winnerEspectedScore: number =
			winnerPrecomputed / (winnerPrecomputed + loserPrecomputed);
		return Math.trunc(K * (1 - winnerEspectedScore));
	}

	constructor(playerToken: string, playerRating: number) {
		this.token_ = playerToken;
		this.rating_ = playerRating;
		this.joinTime_ = Date.now();
		this.matchedWith_ = undefined;
	}

	get token(): string {
		return this.token_;
	}
	get rating(): number {
		return this.rating_;
	}
	get matchedWith(): string | undefined {
		return this.matchedWith_;
	}
	set matchedWith(token: string | undefined) {
		this.matchedWith_ = token;
	}

	//	public ...

	/*
		The wait time is linear in time, 60 seconds open up a range of 100 rating
		There is hard cap at 300 rating difference, 3min of wait time.
	*/
	public ratingRange(timeStamp: number): [number, number] {
		const timeElapsed = (timeStamp - this.joinTime_) / 1000;
		const rangeDilation: number = Math.min(
			timeElapsed * QueuePlayer.five_thirds,
			300
		);
		return [this.rating_ - rangeDilation, this.rating_ + rangeDilation];
	}

	private static readonly five_thirds = 5 / 3; // Rate per second: 100 / 60

	private readonly token_: string;
	private readonly rating_: number;
	private readonly joinTime_: number;
	private matchedWith_: string | undefined;
}
