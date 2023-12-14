export class Challenge {
    constructor(challengerId: number, challengedId: number, timeout: number) {
        this.challengerId_ = challengerId;
        this.challengedId_ = challengedId;
        this.expireDate_ = Date.now() + timeout;
    }

    get challengerId() { return this.challengerId_; }
    get challengedId() { return this.challengedId_; }

    public expired(): boolean {
        return this.expireDate_ < Date.now();
    }

    private readonly challengerId_: number;
    private readonly challengedId_: number;
    private readonly expireDate_: number;
}