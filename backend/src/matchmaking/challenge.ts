export class Challenge {
	constructor(
		gameId: number,
		challengerId: number,
		challengedId: number,
		timeout: number
	) {
		this.id_ =
			challengerId.toString() +
			'-' +
			challengedId.toString() +
			'-' +
			gameId.toString();
		this.gameId_ = gameId;
		this.challengerId_ = challengerId;
		this.challengerId_ = challengerId;
		this.challengedId_ = challengedId;
		this.expireDate_ = Date.now() + timeout;
	}

	get challengerId() {
		return this.challengerId_;
	}
	get challengedId() {
		return this.challengedId_;
	}

	get id() {
		return this.id_;
	}

	get gameId() {
		return this.gameId_;
	}

	public expired(): boolean {
		return this.expireDate_ < Date.now();
	}

	public hasPlayer(id: number): boolean {
		return this.challengerId_ == id || this.challengedId_ == id;
	}

	private readonly id_: string;
	private readonly challengerId_: number;
	private readonly gameId_: number;
	private readonly challengedId_: number;
	private readonly expireDate_: number;
}
