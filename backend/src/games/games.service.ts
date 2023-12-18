import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Game } from './entities/game.entity';
import { Match } from './entities/match.entity';

@Injectable()
export class GamesService {
	constructor(
		@InjectRepository(Game)
		private readonly gameRepository: Repository<Game>,
		@InjectRepository(Match)
		private readonly matchRepository: Repository<Match>
	) {
		this.log = new Logger();
	}

	public async createMatch(data: Partial<Match>): Promise<Match | null> {
		console.log('Creating match', data);
		let newMatch = await this.matchRepository.save(data);
		console.log('Created match', newMatch);
		return newMatch;
	}

	public async findAll(): Promise<Game[]> {
		return this.gameRepository.find();
	}

	public async findGame(id: number): Promise<Game | null> {
		return this.gameRepository.findOneBy({ id: id });
	}

	public async findGameById(name: string): Promise<Game | null> {
		return this.gameRepository.findOneBy({ name: name });
	}

	public async findAllMatches() {
		return this.matchRepository.find({
			relations: ['game', 'players', 'events'],
			select: {
				id: true,
				created_at: true,
				status: true,
				game: {
					id: true
				},
				players: {
					id: true
				},
				events: true
			}
		});
	}

	public async findGamesOf(playerId: number) {
		return await this.matchRepository
			.createQueryBuilder('match')
			.innerJoinAndSelect('match.players', 'player')
			.where('player.id = :id', { id: playerId })
			.andWhere("match.status = 'finished'")
			.getMany();
	}

	public async getActiveMatches() {
		return this.matchRepository.find({
			where: { status: Not('finished') },
			relations: ['game', 'players', 'events']
		});
	}

	public async updateMatchStatus(matchId: number, status: string) {
		return this.matchRepository.update(matchId, { id: matchId, status });
	}

	private log: Logger;
}
