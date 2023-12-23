import { Injectable, Logger } from '@nestjs/common';
import { User } from './entities/user.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Observable, from } from 'rxjs';
import { UserRelation } from './entities/userRelations.entity';
import { ChannelMessages } from 'src/chat/entities/message/channel.entity';
import { UserMessages } from 'src/chat/entities/message/user.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(UserRelation)
		private readonly userRelationRepository: Repository<UserRelation>,
		@InjectRepository(ChannelMessages)
		private readonly channelmessagesRepository: Repository<ChannelMessages>,
		@InjectRepository(UserMessages)
		private readonly usermessagesRepository: Repository<UserMessages>,
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
			}
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
	createUserMessage(priv_message: UserMessages): Observable<UserMessages> {
		return from(this.usermessagesRepository.save(priv_message));
	}
	//Mensajes Canales
	createChatMessage(chan_msg: ChannelMessages): Observable<ChannelMessages> {
		return from(this.channelmessagesRepository.save(chan_msg));
	}
}
