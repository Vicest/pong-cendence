import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	ManyToMany,
	JoinTable,
	ManyToOne
} from 'typeorm';
import { ChannelMessages } from './channel.message.entity';
import { User } from 'src/users/entities/user.entity';
import { MaxLength, MinLength } from 'class-validator';
import { Optional } from '@nestjs/common';
import { ChannelMuted } from './channel.muted.entity';

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
		nullable: true
	})
	@MinLength(4)
	@MaxLength(20)
	name: string;

	@Column({
		nullable: true
	})
	description: string;

	@Column({
		type: 'bytea',
		nullable: true,
		select: false
	})
	@Optional()
	password: Buffer;

	@Column({
		type: 'bytea',
		default: null
	})
	IV: Buffer;

	@Column({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP'
	})
	created_at: Date;

	@OneToMany(() => ChannelMessages, (message) => message.channel, {
		onDelete: 'CASCADE'
	})
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

	@ManyToMany(() => User, (user) => user.id, { cascade: true })
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

	@OneToMany(() => ChannelMuted, (muted) => muted.channel, {
		cascade: true
	})
	muted: ChannelMuted[];

	@Column({
		type: 'enum',
		enum: MessageType,
		default: MessageType.CHANNEL
	})
	type: MessageType;

	@Column({
		type: 'boolean',
		default: false
	})
	hasPassword: boolean;
}
