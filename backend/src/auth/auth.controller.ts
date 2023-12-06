import { Controller, UseGuards, Get, Res, Req, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IntraAuthGuard } from './guards/intraAuth.guard';
import { AuthService } from './auth.service';
import { AdminGuard } from './guards/admin.guard';
import { JwtGuard } from './guards/jwt.guard';
import { JwtRefreshGuard } from './guards/jwtRefresh.guard';

@Controller('auth')
export class AuthController {
	readonly accessTokenCookie = {
		httpOnly: false,
		maxAge: 24 * 60 * 60 * 1000,
	};

	readonly refreshTokenCookie = {
		httpOnly: false,
		maxAge: 3 * 24 * 60 * 60 * 1000,
	};

	constructor(
		private env: ConfigService,
		private authService: AuthService,
	) {}

	@UseGuards(AdminGuard)
	@Get('admin')
	async admin() {
		return 'Yes, you are an admin, want a pat in the back?';
	}

	@UseGuards(JwtGuard)
	@Get('me')
	async getMe(@Req() req, @Res() res) {
		res.send(req.user);
	}

	@UseGuards(JwtRefreshGuard)
	@Get('refresh')
	async getRefresh(@Req() req, @Res() res) {
		const { token, refreshToken } = await this.authService.grantTokenPair(
			req.user,
		);
		res.cookie('token', token, this.accessTokenCookie);
		res.cookie('refreshToken', refreshToken, this.refreshTokenCookie);
		res.send({ token, refreshToken });
	}

	@UseGuards(IntraAuthGuard)
	@Get('login')
	async login() {}

	@UseGuards(IntraAuthGuard)
	@Get('callback')
	async callback(@Req() req, @Res() res) {
		const { token, refreshToken } = await this.authService.grantTokenPair(
			req.user,
		);
		res.cookie('token', token, this.accessTokenCookie);
		res.cookie('refreshToken', refreshToken, this.refreshTokenCookie);
		return res.redirect(
			`${this.env.get<string>('BACKEND_BASE')}:${this.env.get<string>(
				'FRONTEND_PORT',
			)}/app`,
		);
	}
}
