import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Channel } from './channel.entity';
import { MinLength } from 'class-validator';

@Entity({
	name: 'ChannelMessages'
})
export class ChannelMessages {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'text' })
	@MinLength(1)
	content: string;

	@ManyToOne(() => User, (user) => user.id)
	@JoinColumn({
		name: 'user_id'
	})
	sender: User;

	@ManyToOne(() => Channel, (channel) => channel.id, {
		onDelete: 'CASCADE'
	})
	@JoinColumn({
		name: 'channel_id'
	})
	channel: Channel;

	@Column({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP'
	})
	created_at: Date;
}
