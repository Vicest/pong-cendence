import { UserDto } from 'src/users/dto/users.dto';
import { messagesChannelDto } from './message/channel.dto';
export class ChannelDto {
	name: string;
	description: string;
	password: string;
	created_at: Date;
	members: UserDto[];
	messages: messagesChannelDto[];
}
