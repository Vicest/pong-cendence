import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import Strategy = require('passport-42');
import { AuthService } from './auth.service';

@Injectable()
export class Intra42Strategy extends PassportStrategy(Strategy, '42') {
    constructor(private env:ConfigService, private authService:AuthService) {
        super({
            clientID: env.get<string>('CLIENT_ID'),
            clientSecret: env.get<string>('CLIENT_SECRET'),
            callbackURL: env.get<string>('REDIRECT_URI'),
            profileFields: {
                'login': 'login'
            }
        })
    }

    //TODO Nope, not all problems are solved using 'any'
    async validate(token:string, refreshToken:string, profile:{login:string}, cb:any) {
        console.log(`Validaste ${profile.login}! Su token: ${token}, gracias.`);
        return await this.authService.validateUser(profile.login);
    }
}
