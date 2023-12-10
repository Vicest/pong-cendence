import { Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { GamesService } from './games.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('games')
@UseGuards(JwtGuard)
export class GamesController {
	constructor(private gamesService: GamesService) {}

	@Get('')
	public ongoingGames() {
        //TODO reduced info
        return this.gamesService.games;//Maybe it nees to access DB?
	}

	@Get('leaderboard')
	public leaderboard() {
        //TODO reduced info
        return 'ywah.... later';
	}

	@Get(':id')
	public game(@Param(':id') id:number) {
        //TODO full info
        return this.gamesService.game(id);//Maybe it nees to access DB?
	}

    @Post(':id')
    public async joinQueue(@Param(':id') id:number) {
        return this.gamesService.joinQueue(id);
    }

    @Delete(':id')
    public async leaveQueue(@Param(':id') id:number) {
        return this.gamesService.leaveQueue(id);
    }
}
