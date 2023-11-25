import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
//import Strategy = require('passport-jwt');
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private env:ConfigService, private authService:AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromCookie('token'),
            ignoreExpiration: false,
            secretOrKey: 'TODO use environment for this',
        })
    }

    //TODO Nope, not all problems are solved using 'any'
    async validate(payload:any) {
        const ourUser = {id:payload.id, login:payload.nickname};
        console.log(`Validado jwt: ${ourUser}`);
        return ourUser;
    }
}
