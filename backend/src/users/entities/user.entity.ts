import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	ManyToMany,
	JoinTable
} from 'typeorm';
import { Channel } from '../../chat/entities/channel.entity';
import { ChannelMembers } from 'src/chat/entities/channelmembers.entity';
import { UserMessages } from 'src/chat/entities/message/user.entity';
import { ChannelMessages } from 'src/chat/entities/message/channel.entity';
import { UserRelation } from './userRelations.entity';

enum MemberType {
	INVITED = 'Invited',
	BANNED = 'Banned',
	MEMBER = 'Member',
	ADMIN = 'Admin',
	OWNER = 'Owner'
}

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
		type: 'text',
		nullable: true,
		default: null
	})
	avatar: string;
	@Column({
		type: 'bytea',
		nullable: true,
		default: null,
		select: false
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
		enum: ['online', 'offline', 'in_game', 'away', 'busy', 'invisible'],
		default: 'offline'
	})
	status: string;

	@Column({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP'
	})
	created_at: Date;

	// @ManyToMany(() => Channel, (channel) => channel.members)
	// channels: Channel[];

	@OneToMany(() => ChannelMessages, (message) => message.sender)
	channel_messages: ChannelMessages[];

	@OneToMany(() => UserMessages, (message) => message.sender)
	sent_messages: UserMessages[];

	@OneToMany(() => UserMessages, (message) => message.receiver)
	received_messages: UserMessages[];

	_privateMessages: UserMessages[];

	async loadPrivateMessages(): Promise<void> {
		const privateMessages = await Promise.all([
			this.sent_messages,
			this.received_messages
		]);
		this._privateMessages = privateMessages[0].concat(privateMessages[1]);
	}

	get privateMessages(): UserMessages[] {
		return this._privateMessages;
	}

	@OneToMany(() => UserRelation, (UserRelation) => UserRelation.sender)
	relationshared: UserRelation[];

	@OneToMany(() => UserRelation, (UserRelation) => UserRelation.receptor)
	relationsharedAsReceiver: UserRelation[];

	_relationList: UserRelation[];
	channel_status: MemberType;

	async loadrelationsList(): Promise<void> {
		const relationList = await Promise.all([
			this.relationshared,
			this.relationsharedAsReceiver
		]);
		this._relationList = relationList[0].concat(relationList[1]);
	}

	get relationsList(): UserRelation[] {
		return this._relationList;
	}
	friends: User[];

	@OneToMany(() => ChannelMembers, (channelmembers) => channelmembers.user)
	channels_relation: ChannelMembers[];

	async loadChannels(): Promise<void> {
		if (!this.channels_relation) {
			return; // Retorna si channels_relation es undefined o null
		}

		const filteredChannels = this.channels_relation.filter(
			(channels_relation) => {
				return channels_relation.status !== MemberType.INVITED;
			}
		);

		this.channels = filteredChannels.map((channel) => channel.channel);

		this.channels.forEach((channel) => {
			channel.loadMembers();
		});
	}
	channels: Channel[];

	async loadChannelsInvitations(): Promise<void> {
		if (!this.channels_relation) {
			return;
		}
		const filteredChannels = this.channels_relation.filter(
			(channels_relation) => {
				return channels_relation.status === MemberType.INVITED;
			}
		);
		this.channels = filteredChannels.map((channel) => channel.channel);
		this.channels.forEach((channel) => {
			channel.loadMembers();
		});
	}
	invite_channels: Channel[];

	// @ManyToMany(() => Channel, (channel) => channel.members)
	// @JoinTable({
	// 	name: 'ChannelMembers',
	// 	joinColumn: {
	// 		name: 'user_id'
	// 	},
	// 	inverseJoinColumn: {
	// 		name: 'channel_id'
	// 	}
	// })
	// channels: Channel[];

	// @OneToMany(() => ChannelMembers, (channelMembers) => channelMembers.channel)
	// channels: Channel[];

	// @ManyToMany(() => UserRelation, UserRelation => (UserRelation.receptor))
	// @JoinTable({
	//   name: 'UserRelation',
	//   joinColumn: {
	//     name: 'receptor'
	//   },
	//   inverseJoinColumn: {
	//     name: 'sender'
	//   }
	// })
	// relationshared: UserRelation[];
}
