	// Types
	export interface Person {
		id: number;
		avatar: number;
		name: string;
	}
	export interface MessageFeed {
		id: number;
		host: boolean;
		avatar: number;
		name: string;
		timestamp: string;
		message: string;
		color: string;
	}