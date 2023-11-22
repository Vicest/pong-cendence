import { Controller, UseGuards, Get, Res, Post, Redirect, Param } from '@nestjs/common';
import { Response } from 'express';
import { IntraAuthGuard } from './intraAuth.guard';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private usersService:UsersService, private authService:AuthService) {}

	//FIXME any login request should be a POST, not a GET.
    @UseGuards(IntraAuthGuard)
	@Get('login')
	async login() : Promise<string> {
		return "HI";
	}

	//@UseGuards(IntraAuthGuard)
	@Get('validate')
	async validate() {}
	/*
	//FIXME this endpoint should not exist, the redirect should happen towards front.
    @UseGuards(IntraAuthGuard)
	@Get('callback')
	//@Redirect('localhost:5000/auth/dbg')
	async callback(@Res() res: Response) {
		//TODO Request auth
		//TODO Recieve Auth code
		//Then Request token with code
		//Then recieve access token
		//Then I can use access token to talk with intra but whatever

		console.log("This should happen after validation");
		const token = await this.authService.grantToken("VALIDATED!")
		console.log(token);
		//res.json(token);
		//return res.set({ 'x-access-token': token }).json({})//
		res.redirect('localhost:5000/auth/dbg');
		console.log("After redirect");
		//console.log(res);

		return token;
	}
	*/

	//@UseGuards(RegisterGuard)
	/*@Post('register:login')
	//@Redirect('localhost:5000/auth/dbg')
	async register(@Param() param:{login:string}, @Res() res: Response) {
		console.log("Register function called")
		if (!this.authService.validateUser(param.login)) {
			//Do the registering
		} else {
			//Set the httpResponse status to 'unmodified'
		}

		return "Register request.";
	}*/
}
