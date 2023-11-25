//import { Controller, UseGuards, Get, Res, Post, Redirect, Param, Req } from '@nestjs/common';
//import { Request } from 'express';
//import { IntraAuthGuard } from './intraAuth.guard';
//import { UsersService } from '../users/users.service';
//import { AuthService } from './auth.service';
//
//@Controller('profile')
//export class AuthController {
//    constructor(private usersService:UsersService, private authService:AuthService) {}
//
//	@Post('nickname')
//	async updateNick(@Req() req:Request) {
//		if (req.user)
//			console.log("Session for user ", req.user);
//	}
//
//	@Post('avatar')
//	async updateAvatar(@Req() req:Request) {
//		if (req.user)
//			console.log("Session for user ", req.user);
//	}

	////FIXME any login request should be a POST, not a GET.
    //@UseGuards(IntraAuthGuard)
	//@Get('login')
	//async login() : Promise<string> {
	//	return "HI";
	//}
//
	////@UseGuards(IntraAuthGuard)
	//@Get('validate')
	//async validate() {}

//}
