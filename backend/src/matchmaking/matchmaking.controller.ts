import {
	Controller,
	Post,
	Delete,
	UseGuards,
	Req
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { MatchMakingService } from './matchmaking.service';
import { AuthService } from 'src/auth/auth.service';

@Controller('matchmaking')
@UseGuards(JwtGuard)
export class MatchMakingController {
	constructor(
		private readonly matchMakingService: MatchMakingService,
		private readonly authService: AuthService
	) {}

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
