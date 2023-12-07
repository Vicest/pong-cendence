import { User } from 'src/users/entities/user.entity';
import { Channel } from '../../entities/channel.entity';

export class messagesChannelDto {
	id: number;
	content: string;
	sender: User;
	receiver: Channel;
	created_at: Date;
}
