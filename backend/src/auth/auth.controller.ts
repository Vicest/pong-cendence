import { Controller, UseGuards, Get, Res, Post, Param, Req, Session, Redirect } from '@nestjs/common';
import { Request } from 'express';
import { IntraAuthGuard } from './intraAuth.guard';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { User } from 'src/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
    constructor(private env:ConfigService, private usersService:UsersService, private authService:AuthService) {}

    @UseGuards(JwtGuard)
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

    @UseGuards(IntraAuthGuard)
	@Get('login')
	async login() {}

    @UseGuards(IntraAuthGuard)
	@Get('callback')
	async callback(@Session() session:Record<string, any>, @Req() req , @Res() res) {
		const userToken = await this.authService.grantToken(req.user);
		console.log("User token", userToken);
		res.cookie('token', userToken, { httpOnly: true });
		return res.redirect(`${this.env.get<string>('BASENAME')}:${this.env.get<string>('FRONTEND_PORT')}/app`);
	}
}
