export interface Person {
	id: number;
	login: string;
	nickname: string;
	avatar: string;
	two_factor_auth_enabled: boolean;
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
	id: number;
	nickname: string;
	descripcion: string;
	password: string;
	created_at: Date;
	members: Person[];
	// feed: MessageFeed[];
}
