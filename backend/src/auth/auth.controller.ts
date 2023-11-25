import { Controller, UseGuards, Get, Res, Post, Param, Req, Session, Redirect } from '@nestjs/common';
import { Request } from 'express';
import { IntraAuthGuard } from './intraAuth.guard';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { User } from 'src/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
    constructor(private env:ConfigService, private usersService:UsersService, private authService:AuthService) {}

    //@UseGuards(IntraAuthGuard)
	@Get('test')
	async test(@Session() session:Record<string, any>, @Req() req , @Res() res) {

		console.log(req.session);
		console.log("////////////////");
		//console.log(res.session.user);
		//return `${req}`
		//console.log(session);
		//if (req.user)
		//	console.log("Session for user ", req.user);
		//else
		//	console.log("Rock u like a hurricane");
	}

	//FIXME any login request should be a POST, not a GET.
    @UseGuards(IntraAuthGuard)
	@Get('login')
	async login() {}

    @UseGuards(IntraAuthGuard)
	@Get('callback')
	async callback(@Session() session:Record<string, any>, @Req() req , @Res() res) {
		//res.redirect("localhost:4200");
		//return '/';
		console.log("resuser");
		console.log(req.user);
		console.log("resuser");
		const userToken = await this.authService.grantToken(req.user);
		console.log(userToken);
		console.log("-----------");
		res.cookie('token', userToken, { httpOnly: true });
		return res.redirect(`${this.env.get<string>('BASENAME')}:${this.env.get<string>('FRONTEND_PORT')}/app`);
		//console.log(res.session.user);
		//session.auth = true;
		//res.json({token:userToken});
		//return res.json({token:userToken})//.redirect('http://localhost:4200/');
		//return res.json({token:userToken}).redirect('http://localhost:4200/');
	}

	//@UseGuards(IntraAuthGuard)
	@Get('validate')
	async validate() {}
//
//	@UseGuards(LoginGuard)
//	@Post('login')
//	async register() {
//		
//	}
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
