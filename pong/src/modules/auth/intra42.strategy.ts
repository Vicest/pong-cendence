import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import Strategy = require('passport-42');

@Injectable()
export class Intra42Strategy extends PassportStrategy(Strategy, '42') {
    constructor(private env:ConfigService) {
        super({
            clientID: env.get<string>('CLIENT_ID'),
            clientSecret: env.get<string>('CLIENT_SECRET'),
            callbackURL: env.get<string>('REDIRECT_URI'),
            profileFields: {
                'username': 'login'
            }
        })
    }

    //TODO Nope, not all problems are solved using 'any'
    async validate(token:string, refreshToken:string, profile:any, cb:any): Promise<any> {
        console.log(`Validaste ${profile}! Su token: ${token}, gracias.`);
        return true;//TODO request a validation to the API? Mauybe return the User entity
    }
}
