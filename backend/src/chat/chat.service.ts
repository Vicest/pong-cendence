import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { Observable, from } from 'rxjs';
import { ChannelMessages } from 'src/chat/entities/message/channel.entity';
import { UserMessages } from 'src/chat/entities/message/user.entity';
import { Channel } from 'src/chat/entities/channel.entity';
import { User } from 'src/users/entities/user.entity';
import { ChannelMembers } from './entities/channelmembers.entity';


enum MemberType {
	INVITED = 'Invited',
	BANNED = 'Banned',
	MEMBER = 'Member',
    ADMIN = 'Admin',
    OWNER = 'Owner'
}

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(Channel)
		private readonly channelRepository: Repository<Channel>,
		@InjectRepository(ChannelMessages)
		private readonly channelmessagesRepository: Repository<ChannelMessages>,
		@InjectRepository(UserMessages)
		private readonly usermessagesRepository: Repository<UserMessages>,
		@InjectRepository(ChannelMembers)
		private readonly channelMembersRepository: Repository<ChannelMembers>
		
		
	) {
		this.log = new Logger();
	}

	private log: Logger;

	/*Con Dios me disculpo por esta aberracion de función ...
        pero situaciones drasticas requieren medidas drasticas*/
	async findUserMessages(
		login: string,
		login2: string
	): Promise<UserMessages[] | undefined> {
		let contents = await this.usermessagesRepository.find({
			where: [
				{ sender: { login }, receiver: { login: login2 } },
				{ sender: { login: login2 }, receiver: { login } }
			],
			relations: ['sender', 'receiver']
		});
		return contents;
	}

	async findUserMessagesHistory(
		id: number
	): Promise<UserMessages[] | undefined> {
		let contents = await this.usermessagesRepository.find({
			where: [{ sender: { id } }, { receiver: { id } }],
			relations: ['sender', 'receiver']
		});
		// console.log('HAY MENSAJES DE ', id, ' que son -> ', contents);
		return contents;
	}

	createUserMessage(priv_message: UserMessages): Observable<UserMessages> {
		return from(this.usermessagesRepository.save(priv_message));
	}

	createChatMessage(chan_msg: ChannelMessages): Observable<ChannelMessages> {
		return from(this.channelmessagesRepository.save(chan_msg));
	}

	createChannel(channel: Channel): Observable<Channel> {
		return from(this.channelRepository.save(channel));
	}

	createUserChannelRelation(id_user: number, id_channel: number ,status: MemberType): Observable<ChannelMembers> {
		let userRelation = new ChannelMembers();
		userRelation.channel_id = id_channel;
		userRelation.user_id = id_user;
		userRelation.status = status;
		return from(this.channelMembersRepository.save(userRelation));
	}

	async findChannelMember(channel_id: number, user_id : number): Promise<ChannelMembers | undefined> {
		let contents = await this.channelMembersRepository.findOne({
			where: { channel_id, user_id },
		});
		return contents;
	}

	async updateChannelMember(channel_id: number, user_id : number, status:MemberType): Promise<ChannelMembers | undefined> {
		let contents = await this.channelMembersRepository.findOne({
			where: { channel_id, user_id },
		});
		if (contents) {
            contents.status = status;
            let update = await this.channelMembersRepository.save(contents); 
            return update; 
        }

	}

	async deleteChannelMember(channel_id: number, user_id : number): Promise<boolean> {
		let channelMember = await this.channelMembersRepository.findOne({
			where: { channel_id, user_id },
		});
		if (channelMember)
		{
			(await this.channelMembersRepository.delete({ channel_id, user_id }));
			return true;
		}
	
		return false;
	}

	async findChannelsbyUserID(id: number): Promise<Channel[] | undefined> {
		// return contents;
		let contents = await this.userRepository.findOne({
			where: { id },
			relations: [
				'channels_relation.channel.channels_relation.user',
				'channels_relation.channel.messages.sender'
			]
		});
		console.log(' User : be like ', id);
		contents.loadChannels()
		return contents.channels;
	}

	async findChannelsbyChannelID(id: number): Promise<Channel | undefined> {
		// return contents;
		let contents = await this.channelRepository.findOne({
			where: { id }
		});
		return contents;
	}

	async findInvitationsChannelsbyID(id: number): Promise<Channel[] | undefined> {
		// return contents;
		let contents = await this.userRepository.findOne({
			where: { id },
			relations: [
				'channels_relation.channel.channels_relation.user',
				'channels_relation.channel.messages.sender'
			]
		});
		contents.loadChannelsInvitations()
		return contents.channels;
	}	

	async findChannelswhereimnot(id: number): Promise<Channel[] | undefined> {
		
		const allChannels = await this.channelRepository.find({
			relations: ['channels_relation.user']
		});

		allChannels.forEach((channel) => {
			channel.loadMembers();
		});
		
		const channelsWhereImNot = allChannels.filter((channel) => {
			// Filtrar canales donde el usuario no es miembro
			return !channel.members.find((member) => member.id === id);
		});

		return channelsWhereImNot;
		return undefined;
	}


}
