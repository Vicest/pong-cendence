import { User } from 'src/users/entities/user.entity';

export class messagesUserDto {
	id: number;
	content: string;
	sender: User;
	receiver: User;
	created_at: Date;
}
