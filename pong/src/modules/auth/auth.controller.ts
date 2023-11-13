import { Controller, Get, UseGuards } from '@nestjs/common';
import { IntraAuthGuard } from './intraAuth.guard';

@Controller('auth')
export class AuthController {
	constructor() {}

    @UseGuards(IntraAuthGuard)
	@Get('login')
	async login() {
		//TODO Request auth
		//TODO Recieve Auth code
		//Then Request token with code
		//Then recieve access token
		//Then I can use access token to talk with intra but whatever

		console.log("Frik")
		return "I DEFINITELY KNOW WHAT I'M DOING!";
	}

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
}