import {
	Controller,
	UseGuards,
	Get,
	Res,
	Req,
	Post,
	Body,
	UnauthorizedException
} from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '../../users/entities/user.entity';
import { JwtUser } from '../auth.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class Jwt2faStrategy extends PassportStrategy(Strategy, 'jwt-2fa') {
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
		console.log('Payload:', JSON.stringify(payload), '\nRaw:', payload);
		console.log(
			'2fav:',
			payload.twofavalidated,
			'\n2faen:',
			payload.twofaenabled
		);
		return await payload;
	}
}
