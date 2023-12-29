import { Controller, Post, Delete, UseGuards, Req, Get } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { MatchMakingService } from './matchmaking.service';

@Controller('matchmaking')
@UseGuards(JwtGuard)
export class MatchMakingController {
	constructor(
		private readonly matchMakingService: MatchMakingService
	) {}

	@Get('/queue')
	getQueue() {
		return this.matchMakingService.getAll();
	}

	@Post('/queue')
	async joinQueue(@Req() req) {
		console.log(`Joining user ${req.user.login} with id ${req.user.id}`);
		return this.matchMakingService.joinQueue(req.user);
	}

	@Delete('/queue')
	async leaveQueue(@Req() req) {
		console.log(`Leaving user ${req.user.login} with id ${req.user.id}`);
		return this.matchMakingService.leaveQueue(req.user.id);
	}
}
