import { Injectable, Logger } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity'

@Injectable()
export class Serializer extends PassportSerializer {
    
    constructor(private usersService: UsersService) {
        super();
        this.log = new Logger();
    }

    serializeUser(user: User, done:Function) {
        this.log.verbose("Serializing", user);
        done(null, user);
    }

    async deserializeUser(serializedUser:any, done:Function) {
        this.log.verbose("Deserializing", serializedUser);
        const user:User|null = await this.usersService.find(serializedUser.id);
        return done(null, user);
    }

    private log:Logger;
}