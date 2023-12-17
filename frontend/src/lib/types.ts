export interface Person {
	id: number;
	login: string;
	nickname: string;
	avatar: string;
	two_factor_auth_enabled: boolean;
	status: 'online' | 'offline' | 'away' | 'busy' | 'invisible';
	// feed: MessageFeed[];
}
export interface PrivateMessageFeed {
	created_at: any;
	content: any;
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
	// feed: MessageFeed[];
}

type GameType = 'pong' | 'tetris';

export interface Game {
	id: number;
	name: GameType;
	image: string;
	title: string;
	description: string;
	create_at: Date;
	creator: string;
	enabled: boolean;
	launched_at: Date;
}

export interface GameInstance {
	id: number;
	game: GameType;
	players: number[];
	created_at: Date;
	status: 'waiting' | 'running' | 'finished' | 'paused';
}
