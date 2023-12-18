export interface JwtUser {
	id: number;
	login: string;
	isAdmin: boolean;
    twofaenabled:boolean;
    twofavalidated:boolean;
    iv:Buffer;
}
