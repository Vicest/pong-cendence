import { Injectable, Logger } from '@nestjs/common';
import { User } from './entities/user.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { Observable, from } from 'rxjs';
import { UserRelation } from './entities/userRelations.entity';
import { Channel } from 'src/chat/entities/channel.entity';
import { ChannelMessages } from 'src/chat/entities/channel.message.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(UserRelation)
		private readonly userRelationRepository: Repository<UserRelation>,
		@InjectRepository(ChannelMessages)
		private readonly messageRepository: Repository<ChannelMessages>
	) {
		this.log = new Logger();
	}
	//TODO I suspect that create simply returns User or some sort of error.
	public async create(data): Promise<User | null> {
		console.log('Creating user', data.login);
		try {
			let fields = JSON.parse(data._raw);
			const newUser: User | null = await this.userRepository.create({
				nickname: data.login,
				isRegistered: false,
				avatar: fields.image?.link,
				login: data.login
			});
			this.log.debug(`Created user ${newUser}`);
			if (newUser) await this.userRepository.save(newUser);
			return newUser;
		} catch (error) {
			this.log.error(`Error parsing fields ${error}`);
			return null;
		}
	}

	public async updateUser(id: number, user: Partial<User>): Promise<User> {
		await this.userRepository.update(id, user);
		return this.userRepository.findOne({ where: { id } });
	}

	public async find(id: number): Promise<User | null> {
		return this.userRepository.findOneBy({ id: id });
	}

	public async findAll(): Promise<User[]> {
		return this.userRepository.find({
			order: {
				id: 'ASC'
			}
		});
	}

	public async findOne(login: string): Promise<User | null> {
		return this.userRepository.findOneBy({ login: login });
	}

	public async findNickname(nickname: string): Promise<User | null> {
		return this.userRepository.findOneBy({ nickname: nickname });
	}

	private log: Logger;

	public updateById(id: number, userUpdate: User): Promise<UpdateResult> {
		return this.userRepository.update(
			{ id },
			{
				...userUpdate,
				id
			}
		);
	}

	public updateStatusById(
		id: number,
		userUpdate: User['status']
	): Promise<UpdateResult> {
		return this.userRepository.update(
			{ id },
			{
				status: userUpdate,
				id
			}
		);
	}

	createUser(user: User): Observable<User> {
		return from(this.userRepository.save(user));
	}

	async getUserWithRelations(nickname: string): Promise<User | undefined> {
		let contents = await this.userRepository.findOne({
			where: { nickname },
			relations: ['relationshared', 'private_messages', 'channel_messages']
		});
		console.log(contents);
		return contents;
	}

	//Funciones para el chat
	//Mensajes privados
	createUserMessage(
		priv_message: ChannelMessages
	): Observable<ChannelMessages> {
		return from(this.messageRepository.save(priv_message));
	}
	//Mensajes Canales
	createChatMessage(chan_msg: ChannelMessages): Observable<ChannelMessages> {
		return from(this.messageRepository.save(chan_msg));
	}

	sendPrivateMessage(sender: User, receptor: User, message: string) {
		return this.messageRepository.save({
			sender,
			receiver: receptor,
			content: message
		});
	}

	sendChannelMessage(sender: User, channel: Channel, message: string) {
		return this.messageRepository.save({
			sender,
			channel,
			content: message
		});
	}
}

// /*Con Dios me disculpo por esta aberracion de función ...
//     pero situaciones drasticas requieren medidas drasticas*/
// 	async findMessages(nickname: string): Promise<User | undefined> {
// 		let contents = await this.userRepository.findOne({
// 			where: { nickname },
// 			relations: [
// 				'relationshared',
// 				'relationshared.sender',
// 				'relationshared.receptor',
// 				'relationsharedAsReceiver',
// 				'relationsharedAsReceiver.sender',
// 				'relationsharedAsReceiver.receptor', //I hate it
// 				'channels',
// 				'channels.messages',
// 				'channels.messages.sender',
// 				'channels.members',
// 				'sent_messages',
// 				'sent_messages.sender',
// 				'sent_messages.receiver',
// 				'received_messages',
// 				'received_messages.sender',
// 				'received_messages.receiver',
// 			], //Puta mierda esta bro :v
// 		});

// 		if (contents) {
// 			await contents.loadPrivateMessages();
// 			await contents.loadrelationsList();
// 			contents.friends = contents.relationsList
// 				.filter((relation) => relation.status === 1)
// 				.map((relation) =>
// 					relation.sender_id === contents.id
// 						? relation.receptor
// 						: relation.sender,
// 				);
// 		}
// 		delete contents._relationList;
// 		delete contents.sent_messages;
// 		delete contents.received_messages;
// 		delete contents.relationshared;
// 		delete contents.relationsharedAsReceiver;
// 		// console.log(contents);
// 		return contents;
// 	}
