import { Controller, UseGuards, Get, Res, Req, Post, Body } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IntraAuthGuard } from './intraAuth.guard';
import { AuthService } from './auth.service';
import { AdminGuard } from './admin.guard';
import { JwtGuard } from './jwt.guard';
import { JwtRefreshGuard } from './jwtRefresh.guard';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
    constructor(private env:ConfigService, private authService:AuthService) {}

    @UseGuards(AdminGuard)
	@Get('admin')
	async admin() {
		return 'Yes, you are an admin, want a pat in the back?';
	}

    @UseGuards(JwtGuard)
	@Get('me')
	async getMe(@Req() req , @Res() res) {
		res.send(req.user);
	}

	@UseGuards(JwtRefreshGuard)
	@Get('refresh')
	async getRefresh(@Req() req , @Res() res) {
		const { token, refreshToken } = await this.authService.grantTokenPair(req.user);
		res.cookie('token', token, { httpOnly: true });
		res.cookie('refreshtToken', refreshToken, { httpOnly: true });
		res.send({ token, refreshToken });
	}

    @UseGuards(IntraAuthGuard)
	@Get('login')
	async login() {}

    @UseGuards(IntraAuthGuard)
	@Get('callback')
	async callback(@Req() req , @Res() res) {
		const { token, refreshToken } = await this.authService.grantTokenPair(req.user);
		res.cookie('token', token, { httpOnly: true });
		res.cookie('refreshtToken', refreshToken, { httpOnly: true });
		return res.redirect(`${this.env.get<string>('BASENAME')}:${this.env.get<string>('FRONTEND_PORT')}/app`);
	}
	@UseGuards(JwtGuard)
	@Get('2FA')
	async get2fa(@Req() req)
	{
		if (req.user.two_factor_auth_enabled == false)
			return (this.authService.generateTwoFactorAuthenticationSecret(req.user))
		
	
	}

	@UseGuards(JwtGuard)
	@Post('2FA')
	async post2fa(@Req() req, @Body() body) 
	{
		return (this.authService.check2FAToken(req.user, body.token))

	}
}
