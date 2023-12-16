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
		const newMatch: Match | null = this.matchRepository.create();
		this.matchRepository.save(data);
		return newMatch;
	}

	public async findAll(): Promise<Game[]> {
		return this.gameRepository.find();
	}

	public async findOne(id: number): Promise<Game | null> {
		return this.gameRepository.findOneBy({ id: id });
	}

	public async findGameByName(name: string): Promise<Game | null> {
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
