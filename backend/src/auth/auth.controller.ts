import {
	Controller,
	UseGuards,
	Get,
	Res,
	Req,
	Inject,
	Post
} from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { IntraAuthGuard } from './guards/intraAuth.guard';
import { AuthService } from './auth.service';
import { AdminGuard } from './guards/admin.guard';
import { JwtGuard } from './guards/jwt.guard';
import { JwtRefreshGuard } from './guards/jwtRefresh.guard';
import { Response } from 'express';
import jwtConfiguration from 'config/jwt';
import frontendConfiguration from 'config/frontend';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
	constructor(
		private env: ConfigService,
		private authService: AuthService,
		@Inject(jwtConfiguration.KEY)
		private jwtConfig: ConfigType<typeof jwtConfiguration>,
		@Inject(frontendConfiguration.KEY)
		private frontendConfig: ConfigType<typeof frontendConfiguration>
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
			req.user
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
	@Get('login')
	async login() {}

	@UseGuards(IntraAuthGuard)
	@Get('callback')
	async callback(@Req() req, @Res() res: Response) {
		const { token, refreshToken } = await this.authService.grantTokenPair(
			req.user
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
}
