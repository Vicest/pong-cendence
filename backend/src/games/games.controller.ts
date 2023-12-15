import {
	Controller,
	Get,
	Post,
	Delete,
	Headers,
	Param,
	UseGuards
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UsersService } from 'src/users/users.service';
import { GamesService } from './games.service';
import { AuthService } from 'src/auth/auth.service';

@Controller('games')
@UseGuards(JwtGuard)
export class GamesController {
	constructor(
		private readonly gameService: GamesService,
		private readonly authService: AuthService
	) {}

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
	getOne(@Param('id') id: number) {
		let game = this.gameService.findOne(id);
		return game;
	}
}
