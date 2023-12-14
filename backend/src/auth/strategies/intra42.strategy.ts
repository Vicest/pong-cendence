import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import Strategy = require('passport-42');
import { AuthService } from '../auth.service';

@Injectable()
export class Intra42Strategy extends PassportStrategy(Strategy, '42') {
	constructor(
		private env: ConfigService,
		private authService: AuthService
	) {
		const redirectUri = env
			.get<string>('BACKEND_BASE')
			.concat(':')
			.concat(env.get<string>('BACKEND_PORT'))
			.concat('/auth/callback');
		super({
			clientID: env.get<string>('CLIENT_ID'),
			clientSecret: env.get<string>('CLIENT_SECRET'),
			callbackURL: redirectUri,
			profileFields: {
				login: 'login',
				avatar: 'avatar'
			}
		});
	}

	async validate(token: string, refreshToken: string, profile, cb: any) {
		return await this.authService.validateUser(profile);
	}
}
