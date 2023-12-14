import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { JwtUser } from '../auth.interface';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
	constructor(
		private env: ConfigService,
		private authService: AuthService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: env.get<string>('JWT_SECRET')
		});
	}

	async validate(payload: JwtUser) {
		const user = await this.authService.validateUser(payload);
		console.log('Admin: ', user);
		if (!user.isAdmin) throw new UnauthorizedException();
		return user;
	}
}
