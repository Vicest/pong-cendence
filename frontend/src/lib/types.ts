export interface Person {
	id: number;
	login: string;
	nickname: string;
	avatar: string;
	two_factor_auth_enabled: boolean;
	status: 'online' | 'offline' | 'away' | 'busy' | 'invisible';
	blocked: Person[];
	invitations: Person[];
	friends: Person[];
	// feed: MessageFeed[];
}

export interface MessageFeed {
	id: number;
	content: string;
	created_at: Date;
	sender: Person;
}

export interface ChannelsChat {
	id: number;
	name: string;
	description: string;
	messages: MessageFeed[];
	created_at: Date;
	type: 'Channel' | 'Direct';
	users: Person[];
	admins: Person[];
	banned: Person[];
	muted: Person[];
	user: Person;
	index: number;
	owner: Person;
	joined: boolean;
	hasPassword: boolean;
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
