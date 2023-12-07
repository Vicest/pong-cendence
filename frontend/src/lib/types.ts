export interface Person {
	id: number;
	nickname: string;
	avatar: string;
	two_factor_auth_enabled: boolean;
	status: 'online' | 'offline' | 'away' | 'busy' | 'invisible';
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
	id: string;
	nickname: string;
	descripcion: string;
	password: string;
	created_at: Date;
	members: Person[];
	feed: MessageFeed[];
}

type GameType = 'pong' | 'tetris';

export interface Game {
	id: GameType;
	name: string;
	cover: string;
	title: string;
	description: string;
	create_at: Date;
	author: string;
	enabled: boolean;
}

export interface GameInstance {
	id: number;
	game: GameType;
	players: number[];
	created_at: Date;
}
