import { Controller, UseGuards, Get, Res, Req, Inject } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { IntraAuthGuard } from './guards/intraAuth.guard';
import { AuthService } from './auth.service';
import { AdminGuard } from './guards/admin.guard';
import { JwtGuard } from './guards/jwt.guard';
import { JwtRefreshGuard } from './guards/jwtRefresh.guard';
import { Response } from 'express';
import jwtConfiguration from 'config/jwt';
import frontendConfiguration from 'config/frontend';

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

	@UseGuards(JwtRefreshGuard)
	@Get('refresh')
	async getRefresh(@Req() req, @Res() res: Response) {
		const { token, refreshToken } = await this.authService.grantTokenPair(
			req.user
		);
		res
			.cookie('token', token, {
				maxAge: this.jwtConfig.expiresIn * 1000
			})
			.cookie('refreshToken', refreshToken, {
				maxAge: this.jwtConfig.refreshExpiresIn * 1000
			});
		res.send({ token, refreshToken });
	}

	@UseGuards(IntraAuthGuard)
	@Get('login')
	async login() {}

	@UseGuards(IntraAuthGuard)
	@Get('callback')
	async callback(@Req() req, @Res() res: Response) {
		const { token, refreshToken } = await this.authService.grantTokenPair(
			req.user
		);
		res
			.cookie('token', token, {
				maxAge: this.jwtConfig.expiresIn * 1000
			})
			.cookie('refreshToken', refreshToken, {
				maxAge: this.jwtConfig.refreshExpiresIn * 1000
			});
		return res.redirect(this.frontendConfig.baseUrl.concat('/app'));
	}
}
