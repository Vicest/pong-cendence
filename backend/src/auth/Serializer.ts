import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity'

@Injectable()
export class Serializer extends PassportSerializer {
    
    constructor(private usersService: UsersService) {
        super();
    }

    serializeUser(user: User, done:Function) {
        console.log("Serializing");
        done(null, user);
    }

    async deserializeUser(serializedUser:any, done:Function) {
        console.log("Deserializing");
        const user:User|null = await this.usersService.find(serializedUser.id);
        return done(null, user);
    }
}