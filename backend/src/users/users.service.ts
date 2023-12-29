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
import { Game } from 'src/games/entities/game.entity';
import { Match } from 'src/games/entities/match.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(Game)
		private readonly gameRepository: Repository<Game>,
		@InjectRepository(Match)
		private readonly matchRepository: Repository<Match>,
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
		console.log('Creating user', data.login);
		try {
			let users = await this.userRepository.count();
			let game = await this.gameRepository.count();
			console.log('Users', users);
			if (users === 0 && game === 0) {
				this.log.debug('First user, granting admin privileges');
				let newGames = await this.gameRepository.create([
					{
						name: 'pong',
						title: 'Classic Pong',
						creator: 'Atari Inc.',
						launched_at: '1972-11-29 00:00:00',
						description:
							'Pong is a classic arcade video game that simulates table tennis. It features simple two-dimensional graphics and involves players controlling paddles to hit a ball back and forth. Its straightforward gameplay and minimalist design made it a massive hit, establishing it as a pioneering title in the world of video games.',
						enabled: true,
						image: '/images/pong/cover.png',
						created_at: new Date()
					},
					{
						name: 'boundless',
						title: 'Boundless Pong',
						creator: "42 Madrid's best coders.",
						launched_at: '2023-12-27 00:00:00',
						description: 'Same as pong, but without boundaries.',
						enabled: true,
						image: '/images/pong/cover2.png',
						created_at: new Date()
					}
				]);
				await this.gameRepository.save(newGames);
				this.log.debug('Games created');
			}

			let fields = JSON.parse(data._raw);
			const newUser: User | null = await this.userRepository.create({
				nickname: data.login,
				isRegistered: false,
				avatar: fields.image?.versions?.medium,
				login: data.login,
				isAdmin: users === 0,
				friends: [],
				blocked: [],
				invitations: []
			});
			this.log.debug(`Created user ${newUser}`);
			if (newUser) await this.userRepository.save(newUser);
			return newUser;
		} catch (error) {
			this.log.error(`Error parsing fields ${error}`);
			return null;
		}
	}

	public async validateUser(user: User, requser: User) {
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
				throw new Error('Error: ' + e.message);
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
			if ((await this.findNickname(user.nickname)) && user.id !== requser.id) {
				throw new BadRequestException('Username already exists');
			}
		}
		return user;
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
		const rankedUsers = await Promise.all(
			allUsers.map(async (user) => {
				return {
					...user,
					rank: await this.getUserRank(user.id)
				};
			})
		);
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
		const query = this.matchRepository
			.createQueryBuilder('match')
			.innerJoin('match.players', 'matchPlayer', 'matchPlayer.user = :userId', {
				userId
			})
			.innerJoinAndSelect('match.players', 'match_player')
			.innerJoinAndSelect('match_player.user', 'user')
			.where("match.status = 'finished'");
		const matchList = await query.getMany();
		//console.log('User ', userId, ' matches:\n', matchList);
		return matchList;
	}

	public async getUserRank(id: number) {
		const matchesPlayed = await this.getUserMatches(id);
		const rankedMatches = matchesPlayed.filter(
			(match) => match.players[0].rankShift !== 0
		);
		let totalRankShift: number = 0;
		for (const match of rankedMatches) {
			for (const matchPlayer of match.players) {
				//The rankShift is set in the winnerPlayer
				if (!matchPlayer.isWinner) continue;
				totalRankShift +=
					matchPlayer.user.id == id
						? matchPlayer.rankShift
						: -matchPlayer.rankShift;
			}
		}
		////No ranked matches means you are 'Unranked'
		return rankedMatches.length > 0 ? 1500 + totalRankShift : -1;
	}

	public async exists(id: number): Promise<boolean> {
		const user = await this.userRepository.findOne({ where: { id: id } });
		return user !== null;
	}

	public async removeFriend(id: number, friend: number): Promise<User> {
		let user = await this.userRepository.findOne({
			where: { id },
			relations: ['friends', 'channels', 'invitations', 'blocked']
		});
		const friendUser = await this.userRepository.findOne({
			where: { id: friend },
			relations: ['friends', 'invitations', 'blocked']
		});

		user.invitations = user.invitations.filter(
			(user) => user.id !== friendUser.id
		);
		user.blocked = user.blocked.filter((user) => user.id !== friendUser.id);
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
		friendUser.blocked = friendUser.blocked.filter(
			(_user) => _user.id !== user.id
		);
		this.userRepository.save(friendUser);
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
			relations: ['friends', 'invitations']
		});
		user.invitations = user.invitations.filter(
			(user) => user.id !== targetUser.id
		);
		targetUser.invitations = targetUser.invitations.filter(
			(user) => user.id !== user.id
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

	public async banUser(id: number, target: number) {
		const user = await this.userRepository.findOne({
			where: { id }
		});
		if (!user.isAdmin) {
			throw new BadRequestException('You are not an admin');
		} else if (user.id === target) {
			throw new BadRequestException('You cannot ban yourself');
		}
		const targetUser = await this.userRepository.findOne({
			where: { id: target }
		});
		if (targetUser.isBanned) {
			throw new BadRequestException('User is already already banned');
		}
		targetUser.isBanned = true;
		return await this.updateById(targetUser.id, targetUser);
	}

	public async unbanUser(id: number, target: number) {
		const user = await this.userRepository.findOne({
			where: { id }
		});
		if (!user.isAdmin) {
			throw new BadRequestException('You are not an admin');
		} else if (user.id === target) {
			throw new BadRequestException('You cannot unban yourself');
		}
		const targetUser = await this.userRepository.findOne({
			where: { id: target }
		});
		if (!targetUser.isBanned) {
			throw new BadRequestException('User is not banned');
		}
		targetUser.isBanned = false;
		return await this.updateById(targetUser.id, targetUser);
	}

	private log: Logger;

	public async updateById(id: number, userUpdate: User) {
		return await this.userRepository.update(
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
