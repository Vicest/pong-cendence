import {
	Controller,
	Get,
	Post,
	Delete,
	Headers,
	Param,
	UseGuards
} from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
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
	async joinQueue(@Headers('authorization') jwtHeader: string) {
		const token = jwtHeader.replace('Bearer ', '');
		console.log(`Token: ${token}`);
		const user = await this.authService.decode(token);
		console.log(`Joining user ${user.login} with id ${user.id}`);
		return this.matchMakingService.joinQueue(user);
	}

	@Delete('/queue')
	async leaveQueue(@Headers('authorization') jwtHeader: string) {
		const token = jwtHeader.replace('Bearer ', '');
		console.log(`Token: ${token}`);
		const user = await this.authService.decode(token);
		console.log(`Leaving user ${user.login} with id ${user.id}`);
		return this.matchMakingService.leaveQueue(user.id);
	}
}
