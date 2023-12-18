import {
	Controller,
	UseGuards,
	Get,
	Res,
	Req,
	Inject,
	Post,
	UnauthorizedException,
	Body
} from '@nestjs/common';

import { ConfigService, ConfigType } from '@nestjs/config';
import { IntraAuthGuard } from './guards/intraAuth.guard';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { AdminGuard } from './guards/admin.guard';
import { JwtGuard } from './guards/jwt.guard';
import { JwtRefreshGuard } from './guards/jwtRefresh.guard';
import { Jwt2faAuthGuard } from './guards/jwt-2fa-auth.guard';
import { Response } from 'express';
import jwtConfiguration from 'config/jwt';
import frontendConfiguration from 'config/frontend';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
	constructor(
		private env: ConfigService,
		private authService: AuthService,
		@Inject(jwtConfiguration.KEY)
		private jwtConfig: ConfigType<typeof jwtConfiguration>,
		@Inject(frontendConfiguration.KEY)
		private frontendConfig: ConfigType<typeof frontendConfiguration>,
		private userservice: UsersService
	) {}

	@UseGuards(AdminGuard)
	@Get('admin')
	async admin() {
		return 'Yes, you are an admin, want a pat in the back?';
	}

	@UseGuards(JwtGuard)
	@Get('me')
	async getMe(@Req() req, @Res() res: Response) {
		res.send(req.user);
	}

	@UseGuards(JwtGuard)
	@Post('logout')
	async logout(@Req() req, @Res() res: Response) {
		return res.clearCookie('token').clearCookie('refreshToken').sendStatus(200);
	}

	@UseGuards(JwtRefreshGuard)
	@Post('refresh')
	async getRefresh(@Req() req, @Res() res: Response) {
		const { token, refreshToken } = await this.authService.grantTokenPair(
			req.user,
			false
		);
		return res
			.cookie('token', token, {
				httpOnly: true,
				sameSite: 'strict',
				secure: this.env.get('NODE_ENV') === 'production' ? true : false,
				maxAge: this.jwtConfig.expiresIn * 1000
			})
			.cookie('refreshToken', refreshToken, {
				httpOnly: true,
				sameSite: 'strict',
				secure: this.env.get('NODE_ENV') === 'production' ? true : false,
				maxAge: this.jwtConfig.refreshExpiresIn * 1000
			})
			.sendStatus(200);
	}

	@UseGuards(ThrottlerGuard, IntraAuthGuard)
	@Throttle({
		default: {
			ttl: 1000,
			limit: 1
		}
	})
	@Get('login')
	async login() {}

	@UseGuards(IntraAuthGuard)
	@Get('callback')
	async callback(@Req() req, @Res() res: Response) {
		const { token, refreshToken } = await this.authService.grantTokenPair(
			req.user,
			false
		);
		return res
			.cookie('token', token, {
				httpOnly: true,
				sameSite: 'strict',
				secure: this.env.get('NODE_ENV') === 'production' ? true : false,
				maxAge: this.jwtConfig.expiresIn * 1000
			})
			.cookie('refreshToken', refreshToken, {
				httpOnly: true,
				sameSite: 'strict',
				secure: this.env.get('NODE_ENV') === 'production' ? true : false,
				maxAge: this.jwtConfig.refreshExpiresIn * 1000
			})
			.redirect(this.frontendConfig.baseUrl.concat('/app'));
	}
	@UseGuards(JwtGuard)
	@Post('2FA')
	async post2fa(@Req() req)
	{
		if (req.user.two_factor_auth_enabled == false)
		{
			const usr = await this.userservice.findOne(req.user.login)
			return (this.authService.generateTwoFactorAuthenticationSecret(usr))
		}
	}
	@UseGuards(JwtGuard)
	@Post('2FAchange')
	async post2fachange(@Body() body, @Req() req)
	{
		console.log(req.user);
		const usr = await this.userservice.findOne(req.user.login)
		this.authService.twofachangestatus(usr, body.token);
	}
	@UseGuards(JwtGuard)
	@Get('get2FAstatus')
	async get2fastatus(@Req() req) {
		return req.user.two_factor_auth_enabled;
	}

	@UseGuards(Jwt2faAuthGuard)
	@Post('2FAcheck')
	async post2fcheck(@Req() req, @Body() body, @Res() res: Response) {
		let user = await this.authService.validateUser(req.user);
		let validate = await this.authService.check2FAToken(user, body.token);
		console.log(validate);
		if (validate) {
			const { token, refreshToken } = await this.authService.grantTokenPair(
				req.user,
				true
			);
			res
				.cookie('token', token, {
					httpOnly: true,
					sameSite: 'strict',
					secure: this.env.get('NODE_ENV') === 'production' ? true : false,
					maxAge: this.jwtConfig.expiresIn * 1000
				})
				.cookie('refreshToken', refreshToken, {
					httpOnly: true,
					sameSite: 'strict',
					secure: this.env.get('NODE_ENV') === 'production' ? true : false,
					maxAge: this.jwtConfig.refreshExpiresIn * 1000
				})
				.sendStatus(200);
		}
		res.sendStatus(400);
	}
}
