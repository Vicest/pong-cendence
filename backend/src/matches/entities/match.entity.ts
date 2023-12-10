import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	ManyToMany,
	JoinTable,
} from 'typeorm';

@Entity({
	name: 'Matches',
})
export class Match {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
	})
	created_at: Date;

	@Column({
		type: 'smallint',
		nullable: false,
	})
	eloTransfer: number;
	
//	@Column({
//		type: 'text',
//		nullable: true,
//		default: null,
//		select: false,
//	})
//	two_factor_auth_secret: string;
//	@Column({
//		default: false,
//	})
//	two_factor_auth_enabled: boolean;
//
//
//	@ManyToMany(() => Channel, (channel) => channel.members)
//	@JoinTable({
//		name: 'ChannelMembers',
//		joinColumn: {
//			name: 'user_id',
//		},
//		inverseJoinColumn: {
//			name: 'channel_id',
//		},
//	})
//	channels: Channel[];
//
//	// @ManyToMany(() => Channel, (channel) => channel.members)
//	// channels: Channel[];
//
//	@OneToMany(() => ChannelMessages, (message) => message.sender)
//	channel_messages: ChannelMessages[];
//
//	// message.sender || message.target
//	// @OneToMany(() => UserMessages, (message => message.sender || message.target ))
//	// messages_privatosos: UserMessages[];
//
//	@OneToMany(() => UserMessages, (message) => message.sender)
//	sent_messages: UserMessages[];
//
//	@OneToMany(() => UserMessages, (message) => message.receiver)
//	received_messages: UserMessages[];
//
//	_privateMessages: UserMessages[];
//
//	async loadPrivateMessages(): Promise<void> {
//		const privateMessages = await Promise.all([
//			this.sent_messages,
//			this.received_messages,
//		]);
//		this._privateMessages = privateMessages[0].concat(privateMessages[1]);
//	}
//
//	get privateMessages(): UserMessages[] {
//		return this._privateMessages;
//	}
//
//	@OneToMany(() => UserRelation, (UserRelation) => UserRelation.sender)
//	relationshared: UserRelation[];
//
//	@OneToMany(() => UserRelation, (UserRelation) => UserRelation.receptor)
//	relationsharedAsReceiver: UserRelation[];
//
//	_relationList: UserRelation[];
//
//	async loadrelationsList(): Promise<void> {
//		const relationList = await Promise.all([
//			this.relationshared,
//			this.relationsharedAsReceiver,
//		]);
//		this._relationList = relationList[0].concat(relationList[1]);
//	}
//
//	get relationsList(): UserRelation[] {
//		return this._relationList;
//	}
//
//	friends: User[];

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
