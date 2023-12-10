import { Injectable, Logger } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { Match } from './entities/match.entity';

@Injectable()
export class MatchesService {
	constructor(
		@InjectRepository(Match)
		private readonly matchRepository: Repository<Match>,
	) {
		this.log = new Logger();
	}

	//TODO I suspect that create simply returns User or some sort of error.
	public async create(data): Promise<Match> {
		const newMatch: Match = this.matchRepository.create({
			eloTransfer: 42,
		});
		this.log.debug(`Created match ${newMatch}`);
		if (newMatch) await this.matchRepository.save(newMatch);
		return newMatch;
	}

	public async find(id: number): Promise<Match | null> {
		return this.matchRepository.findOneBy({ id: id });
	}

	public async findAll(): Promise<Match[]> {
		return this.matchRepository.find();
	}

	private log: Logger;
}
