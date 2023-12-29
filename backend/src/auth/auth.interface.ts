export interface JwtUser {
	id: number;
	login: string;
	isAdmin: boolean;
	twofaenabled: boolean;
	twofavalidated: boolean;
	created_at: Date;
	iv: Buffer;
}
