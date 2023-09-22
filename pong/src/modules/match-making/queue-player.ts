export class QueuePlayer {

	public static ratingIncrease(playerRating:number, opponentRating:number):number {
		//TODO Look at the ELO algorithm formulae
		return 42
	}

	constructor() {
		this.joinTime_ = Date.now()
		this.matchedWith_ = undefined;
	}

	get token():string { return this.token_ }
	get matchedWith():string | undefined { return this.matchedWith_ }

//	public ...

	/*
		The wait time is linear in time, 60 seconds open up a range of 100 rating
		There is hard cap at 300 rating difference, 3min of wait time.
	*/
	public ratingRange(timeStamp:number):[number, number] {
		const timeElapsed = (timeStamp - this.joinTime_) / 1000
		const rangeDilation:number = Math.min(timeElapsed * QueuePlayer.five_thirds, 300)
		return [this.rating_ - rangeDilation, this.rating_ + rangeDilation]
	}

	private static readonly five_thirds = 5 / 3 // Rate per second: 100 / 60

	private readonly token_:string
	private readonly rating_:number
	private readonly joinTime_:number
	private matchedWith_:string | undefined
}
