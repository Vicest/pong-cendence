import {
	Controller,
	UseGuards,
	Get,
	Res,
	Req,
	Inject,
	Post,
	Body,
	UseFilters,
	Catch,
	ArgumentsHost,
	HttpException,
	HttpStatus,
	ExceptionFilter,
	Param
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
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

	catch(exception: unknown, host: ArgumentsHost): void {
		// In certain situations `httpAdapter` might not be available in the
		// constructor method, thus we should resolve it here.
		const { httpAdapter } = this.httpAdapterHost;

		const ctx = host.switchToHttp();

		const httpStatus =
			exception instanceof HttpException
				? exception.getStatus()
				: HttpStatus.INTERNAL_SERVER_ERROR;

		const responseBody = {
			statusCode: httpStatus,
			timestamp: new Date().toISOString(),
			path: httpAdapter.getRequestUrl(ctx.getRequest()),
			error: exception
		};

		httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
	}
}

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

	//TODO: ELIMINAR
	// @Get('/fake/:login')
	// async testUser(@Param('login') login: string, @Req() req, @Res() res) {
	// 	console.log('You need a create an endpoint to bypass the authentication system you just implemented: Roll for Sanity');
	// 	const user = await this.userservice.findOne(login);

	// 	console.log(`Test User: ${JSON.stringify(user)}`)
	// 	const { token, refreshToken } = await this.authService.grantTokenPair(
	// 		user,
	// 		false
	// 	);
	// 	return res
	// 		.cookie('token', token, {
	// 			httpOnly: true,
	// 			sameSite: 'strict',
	// 			secure: this.env.get('NODE_ENV') === 'production' ? true : false,
	// 			maxAge: this.jwtConfig.expiresIn * 1000
	// 		})
	// 		.cookie('refreshToken', refreshToken, {
	// 			httpOnly: true,
	// 			sameSite: 'strict',
	// 			secure: this.env.get('NODE_ENV') === 'production' ? true : false,
	// 			maxAge: this.jwtConfig.refreshExpiresIn * 1000
	// 		})
	// 		.redirect(this.frontendConfig.baseUrl.concat('/app'));
	// }

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
	@UseFilters(AllExceptionsFilter)
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
	@Get('2FA')
	async get2fa(@Req() req) {
		if (req.user.two_factor_auth_enabled == false) {
			const usr = await this.userservice.findOne(req.user.login);
			return this.authService.generateTwoFactorAuthenticationSecret(usr);
		}
	}
	@UseGuards(JwtGuard)
	@Post('2FAchange')
	async post2fachange(@Body() body, @Req() req, @Res() res: Response) {
		let validate = await this.authService.check2FAToken(req.user, body.token);
		if (validate)
		{
			const usr = await this.userservice.findOne(req.user.login);
			this.authService.twofachangestatus(usr, body.token);
			return res.sendStatus(200);
		}
		return res.sendStatus(400);
	}
	@UseGuards(JwtGuard)
	@Get('get2FAstatus')
	async get2fastatus(@Req() req): Promise<boolean> {
		return req.user.two_factor_auth_enabled;
	}

	@UseGuards(Jwt2faAuthGuard)
	@Post('2FAcheck')
	async post2fcheck(@Req() req, @Body() body, @Res() res: Response) {
		let user = await this.authService.validateUser(req.user);
		let validate = await this.authService.check2FAToken(user, body.token);
		if (validate) {
			req.user.twofavalidated = true;
			req.user.twofaenabled = true;
			user.two_factor_auth_enabled = true;
			await this.userservice.save(user);
			const { token, refreshToken } = await this.authService.grantTokenPair(
				req.user,
				true
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
		res.sendStatus(400);
	}
}
