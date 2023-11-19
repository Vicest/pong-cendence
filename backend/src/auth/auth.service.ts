import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, private usersService:UsersService) {}

    public async grantToken(login: string) {
        //TODO should require more work on entities and having the DB up and running
        const user:User = this.usersService.findOne(login);
        //if (!user)
        //    notRegistered()
        return await this.jwtService.signAsync({login:user.nickname, mail:user.email});
    }
}
