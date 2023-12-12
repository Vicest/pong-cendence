import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { JwtUser } from './auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private env:ConfigService, private authService:AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: env.get<string>('JWT_SECRET'),
        })
    }

    async validate(payload:JwtUser) {
        console.log("Payload:", JSON.stringify(payload), "\nRaw:", payload);
        console.log("2fav:", payload.twofavalidated, "\n2faen:", payload.twofaenabled);
        if (!payload.twofavalidated && payload.twofaenabled)
            throw new UnauthorizedException();
        return await payload;
    }
}