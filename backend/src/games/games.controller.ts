import { Controller, Get, Param, ParseIntPipe, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { GamesService } from './games.service';

@Controller('games')
@UseGuards(JwtGuard)
export class GamesController {
	constructor(private readonly gameService: GamesService) {}

	@Get('/')
	getAll() {
		let games = this.gameService.findAll();
		return games;
	}

	//TODO: Fix this
	@Get('/matches')
	getMatches() {
		let matches = this.gameService.findAllMatches();
		return matches;
	}

	@Get('/:id')
	@SetMetadata('skipJwtGuard', true)
	getOne(@Param('id', ParseIntPipe) id: number) {
		let game = this.gameService.findGame(id);
		return game;
	}
}
