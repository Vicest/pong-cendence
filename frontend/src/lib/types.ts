export interface Person {
	id: number;
	nickname: string;
	avatar: string;
	two_factor_auth_enabled: boolean;
	// feed: MessageFeed[];
}
export interface MessageFeed {
	id: number;
	host: boolean;
	avatar: number;
	sender: Person;
	receiver: Person;
	date: string;
	message: string;
}

export interface Group {
	id: number;
	nickname: string;
	descripcion: string;
	password: string;
	created_at: Date;
	members: Person[];
	feed: MessageFeed[];
}

export interface Game {
	name: string;
	cover: string;
	title: string;
	description: string;
	create_at: Date;
	author: string;
	enabled: boolean;

}
