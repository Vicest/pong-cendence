import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	Unique,
	ManyToMany,
	JoinTable,
	OneToOne,
	ManyToOne
} from 'typeorm';
import { ChannelMessages } from './channel.message.entity';
import { User } from 'src/users/entities/user.entity';

export enum MessageType {
	DIRECT = 'Direct',
	CHANNEL = 'Channel'
}

@Entity({
	name: 'Channels'
})
export class Channel {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: 'varchar',
		unique: true,
		length: 20,
		nullable: false
	})
	name: string;

	@Column({
		nullable: true
	})
	description: string;

	@Column({
		nullable: true
	})
	password: string;

	@Column({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP'
	})
	created_at: Date;

	@OneToMany(() => ChannelMessages, (message) => message.channel)
	@JoinTable({
		name: 'ChannelMessages',
		joinColumn: {
			name: 'channel',
			referencedColumnName: 'id'
		},
		inverseJoinColumn: {
			name: 'message',
			referencedColumnName: 'id'
		}
	})
	messages: ChannelMessages[];

	@ManyToOne(() => User, (user) => user.channels)
	owner: User;

	@ManyToMany(() => User, (user) => user.channels, { cascade: true })
	@JoinTable({
		name: 'ChannelUsers',
		joinColumn: {
			name: 'channel',
			referencedColumnName: 'id'
		},
		inverseJoinColumn: {
			name: 'user',
			referencedColumnName: 'id'
		}
	})
	users: User[];

	@ManyToMany(() => User)
	@JoinTable({
		name: 'ChannelAdmins',
		joinColumn: {
			name: 'channel',
			referencedColumnName: 'id'
		},
		inverseJoinColumn: {
			name: 'user',
			referencedColumnName: 'id'
		}
	})
	admins: User[];

	@ManyToMany(() => User)
	@JoinTable({
		name: 'ChannelBanned',
		joinColumn: {
			name: 'channel',
			referencedColumnName: 'id'
		},
		inverseJoinColumn: {
			name: 'user',
			referencedColumnName: 'id'
		}
	})
	banned: User[];

	@ManyToMany(() => User)
	@JoinTable({
		name: 'ChannelMuted',
		joinColumn: {
			name: 'channel',
			referencedColumnName: 'id'
		},
		inverseJoinColumn: {
			name: 'user',
			referencedColumnName: 'id'
		}
	})
	muted: User[];

	@Column({
		type: 'enum',
		enum: MessageType,
		default: MessageType.CHANNEL
	})
	type: MessageType;
}
