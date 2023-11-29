import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
//import Strategy = require('passport-jwt');
import { AuthService } from './auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
    constructor(private env:ConfigService, private authService:AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: env.get<string>('JWT_REFRESH_SECRET'),
        })
    }

    async validate(payload:any) {
        console.log("Validating refresh", payload);
        return await this.authService.validateUser(payload);
    }
}