import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ChannelMessages } from './message/channel.entity';
import { ChannelMembers } from './channelmembers.entity';

enum ChatType {
	PRIVATE = 'Private',
	PROTECTED = 'Protected',
	PUBLIC = 'Public'
}

enum MemberType {
	INVITED = 'Invited',
	BANNED = 'Banned',
	MEMBER = 'Member',
	ADMIN = 'Admin',
	OWNER = 'Owner'
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

	@OneToMany(() => ChannelMembers, (channelMembers) => channelMembers.channel)
	channels_relation: ChannelMembers[];

	async loadMembers(): Promise<void> {
		const filteredMembers = this.channels_relation.filter(
			(channels_relation) => {
				return channels_relation.status !== MemberType.INVITED;
			}
		);
		this.members = filteredMembers.map((channel) => {
			channel.user.channel_status = this.channels_relation.find(
				(relation) => relation.user.id === channel.user.id
			).status;
			return channel.user;
		});
	}
	members: User[];

	@OneToMany(() => ChannelMessages, (message) => message.receiver)
	messages: ChannelMessages[];
}
