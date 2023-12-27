import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { User } from './entities/user.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Observable, from } from 'rxjs';
import { Channel, MessageType } from 'src/chat/entities/channel.entity';
import { UsersGateway } from './users.gateway';
import { ChatGateway } from 'src/chat/chat.gateway';
import { ChannelMessages } from 'src/chat/entities/channel.message.entity';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(ChannelMessages)
		private readonly messageRepository: Repository<ChannelMessages>,
		@InjectRepository(Channel)
		private readonly channelRepository: Repository<Channel>,
		private readonly usersGateway: UsersGateway,
		private readonly chatGateway: ChatGateway,
		private readonly configService: ConfigService
	) {
		this.log = new Logger();
	}

	public async create(data): Promise<User | null> {
		console.log('Creating user', data);
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

	public async validateUser(user:  User, requser: User )
	{
		//Crear imagen y guardarla en el servidor
		if (user.avatar) {
			const imageName = requser.login + Date.now().toString();
			try {
				if (!fs.existsSync('usersdata')) fs.mkdirSync('usersdata');
				fs.writeFile(
					`usersdata/${imageName}.png`,
					user.avatar,
					'base64',
					(err) => {
						console.log(err);
					}
				);
			} catch (e) {
				throw new Error("Error: " + e.message);
			}
			try {
				this.findOne(user.login).then((res) => {
					const pathFile = 'usersdata/' + res.avatar.split('/')[4] + '.png';
					if (fs.existsSync(pathFile)) fs.unlinkSync(pathFile);
				});
			} catch (e) {
				console.log(e);
			}

			// Especificar la url de la imagen del usuario
			const databasePort = this.configService.get<number>('BACKEND_PORT');
			const databaseUri = this.configService.get<string>('BACKEND_BASE');
			user.avatar = `${databaseUri}:${databasePort}/users/${imageName}/img`;
		}

		if (user.nickname) {
			console.log(await this.findNickname(user.nickname))
            if (await this.findNickname(user.nickname)) {
				throw new  BadRequestException("Username already exists")
            }
        }
		return user
	}

	public async save(user: User) {
		return await this.userRepository.save(user);
	}
	public async updateUser(id: number, user: Partial<User>): Promise<User> {
		await this.userRepository.update(id, user);
		return this.userRepository.findOne({ where: { id } });
	}

	public async find(id: number): Promise<User | null> {
		return this.userRepository.findOneBy({ id: id });
	}

	public async findAll() {
		const allUsers = await this.userRepository.find({
			order: {
				id: 'ASC'
			},
			relations: ['blocked', 'invitations', 'friends']
		});
		const rankedUsers = await Promise.all(allUsers.map( async (user) => {
			return {
				...user,
				rank: await this.getUserRank(user.id)
			}
		}));
		//console.log(`All users: ${JSON.stringify(rankedUsers)}`)
		return rankedUsers;
	}

	public async findOne(login: string): Promise<User | null> {
		return this.userRepository.findOneBy({ login: login });
	}

	public async findNickname(nickname: string): Promise<User | null> {
		return this.userRepository.findOneBy({ nickname: nickname });
	}

	public async getUserMatches(userId: number) {
		const query = this.userRepository
			.createQueryBuilder('user')
			.leftJoinAndSelect('user.matches', 'matchPlayer')
			.where('user.id = :userId', { userId });
		const user = await query.getOne();
		return user.matches;
	}
		
	public async getUserRank(id: number) {
		const matchesPlayed = await this.getUserMatches(id);
		const rankedMatches = matchesPlayed.filter((userPlayer) =>  userPlayer.rankShift !== 0);
		let totalRankShift: number = 0;
		for(const userPlayer of rankedMatches) {
			totalRankShift += userPlayer.isWinner ? userPlayer.rankShift : -userPlayer.rankShift;
		}
		////No ranked matches means you are 'Unranked'
		return matchesPlayed.length > 0 ? 1500 + totalRankShift : -1;
	}
 
	public async exists(id: number): Promise<boolean> {
		const user = await this.userRepository.findOne({ where: { id: id } });
		return user !== null;
	}

	public async removeFriend(id: number, friend: number): Promise<User> {
		let user = await this.userRepository.findOne({
			where: { id },
			relations: ['friends', 'channels', 'invitations']
		});
		const friendUser = await this.userRepository.findOne({
			where: { id: friend },
			relations: ['friends', 'invitations']
		});
		
		user.invitations = user.invitations.filter(
			(user) => user.id !== friendUser.id
		);
		user.friends = user.friends.filter((user) => user.id !== friendUser.id);
		this.userRepository.save(user);

		user = await this.userRepository.findOne({
			where: { id }
		});
		friendUser.friends = friendUser.friends.filter(
			(_user) => _user.id !== user.id
		);
		friendUser.invitations = friendUser.invitations.filter(
			(_user) => _user.id !== user.id
		);
		this.usersGateway.server
			.to(['user_' + id, 'user_' + friend])
			.emit('user:friend_removed', {
				from: user,
				to: friendUser
			});
		return this.userRepository.save(user);
	}

	public async sendFriendRequest(id: number, target: number): Promise<User> {
		const user = await this.userRepository.findOne({
			where: { id },
			relations: ['invitations']
		});
		const targetUser = await this.userRepository.findOne({
			where: { id: target }
		});
		user.invitations.push(targetUser);

		let checkChannel = await this.channelRepository.findOne({
			where: [
				{
					name: user.id + '_' + targetUser.id,
					type: MessageType.DIRECT
				},
				{
					name: targetUser.id + '_' + user.id,
					type: MessageType.DIRECT
				}
			]
		});
		if (!checkChannel) {
			let channel = new Channel();
			channel.name = user.id + '_' + targetUser.id;
			channel.type = MessageType.DIRECT;
			channel.users = [user, targetUser];
			channel.owner = user;
			channel.messages = [];
			channel.description =
				'Chat privado entre ' + user.nickname + ' y ' + targetUser.nickname;
			channel = await this.channelRepository.save(channel);
			this.chatGateway.channelCreated(channel);
		}

		this.usersGateway.server
			.to(['user_' + id, 'user_' + target])
			.emit('user:friend_request', {
				from: user,
				to: targetUser
			});
		return this.userRepository.save(user);
	}

	public async acceptFriendRequest(id: number, target: number): Promise<User> {
		const user = await this.userRepository.findOne({
			where: { id },
			relations: ['invitations', 'friends']
		});
		let targetUser = await this.userRepository.findOne({
			where: { id: target },
			relations: ['friends']
		});
		user.invitations = user.invitations.filter(
			(user) => user.id !== targetUser.id
		);

		targetUser.friends.push(user);
		await this.userRepository.save(targetUser);
		targetUser = await this.userRepository.findOne({
			where: { id: target }
		});
		user.friends.push(targetUser);
		this.usersGateway.server
			.to(['user_' + id, 'user_' + target])
			.emit('user:friend_request_accepted', {
				from: user,
				to: targetUser
			});
		return await this.userRepository.save(user);
	}

	public async cancelFriendRequest(id: number, target: number): Promise<User> {
		const user = await this.userRepository.findOne({
			where: { id },
			relations: ['invitations']
		});
		const targetUser = await this.userRepository.findOne({
			where: { id: target }
		});
		user.invitations = user.invitations.filter(
			(user) => user.id !== targetUser.id
		);
		this.usersGateway.server
			.to(['user_' + id, 'user_' + target])
			.emit('user:friend_request_cancelled', {
				from: user,
				to: targetUser
			});
		return this.userRepository.save(user);
	}

	public async unblockUser(id: number, target: number): Promise<User> {
		const user = await this.userRepository.findOne({
			where: { id },
			relations: ['blocked']
		});
		const targetUser = await this.userRepository.findOne({
			where: { id: target }
		});
		user.blocked = user.blocked.filter((user) => user.id !== targetUser.id);
		this.usersGateway.server
			.to(['user_' + id, 'user_' + target])
			.emit('user:unblocked', {
				from: user,
				to: targetUser
			});
		return this.userRepository.save(user);
	}

	public async blockUser(id: number, target: number): Promise<User> {
		const user = await this.userRepository.findOne({
			where: { id },
			relations: ['blocked']
		});
		const targetUser = await this.userRepository.findOne({
			where: { id: target }
		});
		user.blocked.push(targetUser);
		this.usersGateway.server
			.to(['user_' + id, 'user_' + target])
			.emit('user:blocked', {
				from: user,
				to: targetUser
			});
		return this.userRepository.save(user);
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

	async addFriend(id: number, friend: number): Promise<User> {
		let user = await this.userRepository.findOne({
			where: { id },
			relations: ['friends']
		});
		let friendUser = await this.userRepository.findOne({
			where: { id: friend }
		});
		user.friends.push(friendUser);

		this.usersGateway.server.to('user_' + id).emit('friend', friendUser);
		this.usersGateway.server.to('user_' + friend).emit('friend', user);

		return await this.userRepository.save(user);
	}

	async findFriends(id: number): Promise<User[]> {
		console.log(
			await this.userRepository
				.createQueryBuilder('user')
				.where('user.id = :id', { id })
				.leftJoinAndSelect('user.friends', 'friends')
				.getMany()
		);
		return (
			await this.userRepository.findOne({
				where: { id },
				relations: ['friends']
			})
		).friends;
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