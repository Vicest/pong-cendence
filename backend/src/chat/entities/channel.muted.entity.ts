import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Channel } from './channel.entity';

@Entity({
	name: 'ChannelMuted'
})
export class ChannelMuted {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.id, {
		eager: true
	})
	user: User;

	@ManyToOne(() => Channel, (channel) => channel.id, {
		eager: true
	})
	channel: Channel;

	@Column({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP'
	})
	expire: Date;
}
