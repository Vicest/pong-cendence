import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Game } from './entities/game.entity';
import { Match } from './entities/match.entity';
import { User } from 'src/users/entities/user.entity';
import { MatchPlayer } from './entities/matchPlayer.entity';

@Injectable()
export class GamesService {
	constructor(
		@InjectRepository(Game)
		private readonly gameRepository: Repository<Game>,
		@InjectRepository(Match)
		private readonly matchRepository: Repository<Match>,
		@InjectRepository(MatchPlayer)
		private readonly matchPlayerRepository: Repository<MatchPlayer>

	) {
		this.log = new Logger();
	}

	public async createMatch(
		data: Partial<Match>,
		p1: {p1: User, rankShift: number},
		p2: {p2: User, rankShift: number}
	): Promise<Match | null> {
		let mp1 = { user: p1.p1, rankShift: p1.rankShift } as MatchPlayer
		let mp2 = { user: p2.p2, rankShift: p2.rankShift } as MatchPlayer
		data.players = [
			mp1,
			mp2
		]
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
			relations: ['game', 'players', 'players.user', 'events'],
			select: {
				id: true,
				created_at: true,
				status: true,
				game: {
					id: true
				},
				players: {//FIXME I'm like 100% sure this breaks spectator rails
					id: true,
					user: {//TODO Does this do what I think it does?
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
		return activeMatches;
	}

	public async updateMatchStatus(matchId: number, status: string) {
		return this.matchRepository.update(matchId, { id: matchId, status });
	}

	public async setMatchWinner(matchId: number, winnerId: number) {
		console.log(`Winnner of match ${matchId}: ${winnerId}`);
		const toUpdate = await this.matchPlayerRepository
			.createQueryBuilder('matchUser')
			.innerJoinAndSelect('matchUser.user', 'user', 'user.id = :winnerId', { winnerId })
			.innerJoinAndSelect('matchUser.match', 'match', 'match.id = :matchId', { matchId })
			.getOne();
		console.log(`Setting winner of ${matchId} as ${winnerId}.`);
		console.log("Update relation: ", toUpdate);
		return await this.matchPlayerRepository.update(toUpdate.id, { id: toUpdate.id, isWinner: true });
	}

	private log: Logger;
}
