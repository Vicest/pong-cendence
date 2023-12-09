import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { Observable, from } from 'rxjs';
import { ChannelMessages } from 'src/chat/entities/message/channel.entity';
import { UserMessages } from 'src/chat/entities/message/user.entity';
import { Channel } from 'src/chat/entities/channel.entity';
import { User } from 'src/users/entities/user.entity';
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
		private readonly usermessagesRepository: Repository<UserMessages>
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

	async findChannelsbyID(id: number): Promise<Channel[] | undefined> {
		// return contents;
		let contents = await this.userRepository.findOne({
			where: { id },
			relations: [
				'channels',
				'channels.messages',
				'channels.messages.sender',
				'channels.members'
			] //Puta mierda esta bro :v
		});
		// console.log(' User : be like ', id, contents);
		return contents.channels;
	}

	async findChannelswhereimnot(id: number): Promise<Channel[] | undefined> {
		const allChannels = await this.channelRepository.find({
			relations: ['members']
		});

		const channelsWhereImNot = allChannels.filter((channel) => {
			// Filtrar canales donde el usuario no es miembro
			return !channel.members.find((member) => member.id === id);
		});

		return channelsWhereImNot;
	}
}
