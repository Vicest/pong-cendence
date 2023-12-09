import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	ManyToMany,
	OneToOne,
	PrimaryColumn,
	JoinTable
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ChannelMessages } from './message/channel.entity';

enum ChatType {
	PRIVATE = 'Private',
	PROTECTED = 'Protected',
	PUBLIC = 'Public'
}
@Entity({
	name: 'Channels'
})
export class Channel {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	nickname: string;

	@Column()
	description: string;

	@Column()
	password: string;

	@Column({
		type: 'enum',
		enum: ChatType,
		default: ChatType.PUBLIC
	})
	type: ChatType;

	@Column({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP'
	})
	created_at: Date;

	@ManyToMany(() => User, (user) => user.channels)
	@JoinTable({
		name: 'ChannelMembers',
		joinColumn: {
			name: 'channel_id'
		},
		inverseJoinColumn: {
			name: 'user_id'
		}
	})
	members: User[];

	@OneToMany(() => ChannelMessages, (message) => message.receiver)
	messages: ChannelMessages[];
}
