import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { JwtUser } from '../auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(
		private env: ConfigService,
		private authService: AuthService
	) {
		super({
			jwtFromRequest: (req) => req?.cookies?.token || null,
			ignoreExpiration: false,
			secretOrKey: env.get<string>('JWT_SECRET')
		});
	}

	async validate(payload: JwtUser) {
		let user = await this.authService.validateUser(payload);
		if (!payload.twofavalidated && payload.twofaenabled)
			throw new Error('2FA not validated');
		return user;
	}
}
