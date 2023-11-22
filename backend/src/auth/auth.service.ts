import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, private usersService:UsersService) {
        this.log = new Logger;
    }

    //is valid, already exists, create, error, etc.
    public async validateUser(login: string): Promise<boolean> {
        this.log.verbose(`Validate user ${login}`);
        let user:User|null = await this.usersService.findOne(login);
        this.log.verbose(`${user} found in DB`);
        if(!user) user = await this.usersService.create(login);
        return user != null;
    }

    public async grantToken(login: string) {
        let user:User|null = await this.usersService.findOne(login);
        //TODO Ideally any user would go through a /auth/register endpoint insead of just getting added
        if (!user) user = await this.usersService.create(login);
        console.log('////////////////////////////////////////');
        console.log(user);
        console.log('////////////////////////////////////////');
        return await this.jwtService.signAsync({login:user.nickname/*, mail:user.email FIXME*/});
    }
    
    private log:Logger;
}
