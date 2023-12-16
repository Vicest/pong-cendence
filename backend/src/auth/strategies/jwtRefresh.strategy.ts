import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { JwtUser } from '../auth.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
	Strategy,
	'refresh-jwt'
) {
	constructor(
		private env: ConfigService,
		private authService: AuthService
	) {
		super({
			jwtFromRequest: (req) => req?.cookies?.refreshToken || null,
			ignoreExpiration: false,
			secretOrKey: env.get<string>('JWT_REFRESH_SECRET')
		});
	}

	async validate(payload: JwtUser) {
		return await this.authService.validateUser(payload);
	}
}
