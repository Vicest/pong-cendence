import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	ManyToMany,
	JoinTable
} from 'typeorm';
import { IsOptional, IsBase64, MaxLength, MinLength } from 'class-validator';
import { ChannelMessages } from 'src/chat/entities/channel.message.entity';
import { Channel } from 'src/chat/entities/channel.entity';
import { MatchPlayer } from 'src/games/entities/matchPlayer.entity';
import { ChannelMuted } from 'src/chat/entities/channel.muted.entity';

@Entity({
	name: 'Users'
})
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: 'varchar',
		unique: true,
		length: 20
	})
	login: string;

	@Column({
		type: 'varchar',
		unique: true,
		length: 20
	})
	@MinLength(4)
	@MaxLength(20)
	@IsOptional()
	nickname: string;

	@Column({
		type: 'bool',
		default: false,
		update: false
	})
	isRegistered: boolean;

	@Column({
		type: 'bool',
		default: false
	})
	isAdmin: boolean;

	@Column({
		type: 'bool',
		default: false
	})
	isBanned: boolean;

	@Column({
		type: 'text',
		nullable: true,
		default: null
	})
	@IsBase64()
	@IsOptional()
	avatar: string;

	@Column({
		type: 'bytea',
		nullable: true,
		default: null
	})
	two_factor_auth_secret: Buffer;

	@Column({
		default: false
	})
	two_factor_auth_enabled: boolean;

	@Column({
		type: 'bytea',
		default: null
	})
	IV: Buffer;

	@Column({
		enum: ['online', 'offline', 'busy'],
		default: 'offline'
	})
	status: string;

	@Column({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP'
	})
	created_at: Date;

	@ManyToMany(() => User, (user) => user.friends, {
		cascade: ['insert']
	})
	@JoinTable({
		name: 'UserFriends',
		joinColumn: {
			name: 'user',
			referencedColumnName: 'id'
		},
		inverseJoinColumn: {
			name: 'friend',
			referencedColumnName: 'id'
		}
	})
	friends: User[];

	@OneToMany(() => ChannelMuted, (muted) => muted.user)
	muted: ChannelMuted[];

	@OneToMany(() => MatchPlayer, (match) => match.user)
	matches: MatchPlayer[];

	@ManyToMany(() => User)
	@JoinTable({
		name: 'UserBlocked',
		joinColumn: {
			name: 'user',
			referencedColumnName: 'id'
		},
		inverseJoinColumn: {
			name: 'blocked',
			referencedColumnName: 'id'
		}
	})
	blocked: User[];

	@ManyToMany(() => User, (user) => user.invitations, {
		cascade: ['insert']
	})
	@JoinTable({
		name: 'UserInvitations',
		joinColumn: {
			name: 'user',
			referencedColumnName: 'id'
		},
		inverseJoinColumn: {
			name: 'invited',
			referencedColumnName: 'id'
		}
	})
	invitations: User[];

	@OneToMany(() => Channel, (channel) => channel.owner)
	channels: Channel[];

	@OneToMany(() => ChannelMessages, (message) => message.sender)
	messages: ChannelMessages[];
}
