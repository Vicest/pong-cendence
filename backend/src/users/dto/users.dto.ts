
export class UserDto {
	id: number;
	nickname: string;
	email: string;
	avatar: string;
	two_factor_auth_secret: string;
	two_factor_auth_enabled: boolean;
	status: 'online' | 'offline' | 'away' | 'busy' | 'invisible';
	channels: string[];
	channel_messages: string[];
	private_messages: string[];
}
