import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Game } from './entities/game.entity';
import { Match } from './entities/match.entity';
import { User } from 'src/users/entities/user.entity';
import { MatchPlayer } from './entities/matchPlayer.entity';
import { Chat } from 'src/chat/chat.interface';
import { ChatGateway } from 'src/chat/chat.gateway';
import { Channel, MessageType } from 'src/chat/entities/channel.entity';

@Injectable()
export class GamesService {
	constructor(
		@InjectRepository(Game)
		private readonly gameRepository: Repository<Game>,
		@InjectRepository(Match)
		private readonly matchRepository: Repository<Match>,
		@InjectRepository(MatchPlayer)
		private readonly matchPlayerRepository: Repository<MatchPlayer>,
		@Inject(forwardRef(() => ChatGateway))
		private readonly chatGateway: ChatGateway
	) {
		this.log = new Logger();
	}

	public async createMatch(
		data: Partial<Match>,
		p1: { p1: User; rankShift: number },
		p2: { p2: User; rankShift: number }
	): Promise<Match | null> {
		let mp1 = { user: p1.p1, rankShift: p1.rankShift } as MatchPlayer;
		let mp2 = { user: p2.p2, rankShift: p2.rankShift } as MatchPlayer;
		data.players = [mp1, mp2];
		/** let chat = {
			owner: p1.p1,
			members: [p1.p1, p2.p2],
			admins: [p1.p1, p2.p2],
			type: MessageType.CHANNEL,
			description: 'Match chat'
		};
		data.channel = chat;
		this.chatGateway.channelCreated(result.channel as Channel);*/
		return await this.matchRepository.save(data);
	}

	public async findAll(): Promise<Game[]> {
		return this.gameRepository.find();
	}

	public async findGame(id: number): Promise<Game | null> {
		return this.gameRepository.findOneBy({ id: id });
	}

	public async findGameByName(name: string): Promise<Game | null> {
		return this.gameRepository.findOneBy({ name: name });
	}

	public async findAllMatches() {
		const allMatches = await this.matchRepository.find({
			relations: [
				'game',
				'players',
				'players.user',
				'events',
				'channel.users',
				'channel.admins',
				'channel'
			],
			select: {
				id: true,
				created_at: true,
				status: true,
				game: {
					id: true
				},
				players: {
					//FIXME I'm like 100% sure this breaks spectator rails
					id: true,
					user: {
						//TODO Does this do what I think it does?
						id: true
					}
				},
				events: true
			}
		});
		return allMatches;
	}

	public async findMatch(matchId: number) {
		return await this.matchRepository.findOneBy({ id: matchId });
	}

	public async getActiveMatches() {
		const activeMatches = await this.matchRepository.find({
			where: { status: Not('finished') },
			relations: ['game', 'players', 'players.user', 'events']
		});
		for (let index = 0; index < activeMatches.length; index++) {
			activeMatches[index].players = activeMatches[index].players.sort(
				(a, b) => {
					return a.id - b.id;
				}
			);
		}
		return activeMatches;
	}

	public async updateMatchStatus(matchId: number, status: string) {
		return this.matchRepository.update(matchId, { id: matchId, status });
	}

	public async setMatchWinner(matchId: number, winnerId: number) {
		console.log(`Winnner of match ${matchId}: ${winnerId}`);
		const toUpdate = await this.matchPlayerRepository
			.createQueryBuilder('matchUser')
			.innerJoinAndSelect('matchUser.user', 'user', 'user.id = :winnerId', {
				winnerId
			})
			.innerJoinAndSelect('matchUser.match', 'match', 'match.id = :matchId', {
				matchId
			})
			.getOne();
		console.log(`Setting winner of ${matchId} as ${winnerId}.`);
		console.log('Update relation: ', toUpdate);
		return await this.matchPlayerRepository.update(toUpdate.id, {
			id: toUpdate.id,
			isWinner: true
		});
	}

	private log: Logger;
}
