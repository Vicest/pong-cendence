	// Types
	export interface Person {
		id: number;
		avatar: number;
		name: string;
		feed: MessageFeed[];
	}
	export interface MessageFeed {
		id: number;
		host: boolean;
		avatar: number;
		sender: string;
		receiver: string;
		date: string;
		message: string;
	}