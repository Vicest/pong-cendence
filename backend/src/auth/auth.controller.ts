import { Controller, UseGuards, Get } from '@nestjs/common';
import { IntraAuthGuard } from './intraAuth.guard';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private usersService:UsersService, private authService:AuthService) {}

    @UseGuards(IntraAuthGuard)
	@Get('login')
	async login() : Promise<void> {}

	//FIXME this endpoint should not exist, the redirect should happen towards front.
    @UseGuards(IntraAuthGuard)
	@Get('callback')
	async callback() {
		//TODO Request auth
		//TODO Recieve Auth code
		//Then Request token with code
		//Then recieve access token
		//Then I can use access token to talk with intra but whatever

		console.log("This should happen after validation")
		return "I DEFINITELY AM NOW VALIDATED!";
	}

	@Get('dbg')
	async dgb() {
		//TODO Request auth
		//TODO Recieve Auth code
		//Then Request token with code
		//Then recieve access token
		//Then I can use access token to talk with intra but whatever

		//console.log("This should happen after validation")
		return this.authService.grantToken('LMAO');
	}
}
