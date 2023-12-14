import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './entities/game.entity';
import { Match } from './entities/match.entity';

@Injectable()
export class GamesService {
	constructor(
		@InjectRepository(Game)
		private readonly gameRepository: Repository<Game>,
		@InjectRepository(Match)
		private readonly matchRepository: Repository<Match>,
	) {
		this.log = new Logger();
	}

	public async create(data): Promise<Game | null> {
		console.log('Creating game', data.login);
		return null;
	}

	public async find(id: number): Promise<Game | null> {
		console.log('Finding game', id);
		return null;
	}

	public async findAll(): Promise<Game[]> {
		return this.gameRepository.find();
	}

	public async findOne(id: number): Promise<Game | null> {
		return this.gameRepository.findOneBy({ id: id });
	}

	public async findAllMatches() {
		return this.matchRepository.find({
			relations: ['game', 'players', 'events'],
			select: {
				id: true,
				created_at: true,
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

	private log: Logger;
}
