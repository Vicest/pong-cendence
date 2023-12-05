import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { authenticator } from 'otplib';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, private usersService:UsersService, private env:ConfigService) {
        this.log = new Logger;
    }

    //is valid, already exists, create, error, etc.
    public async validateUser(data): Promise<User|null> {
        this.log.verbose(`Validate user ${data.login}`);
        let user:User|null = await this.usersService.findOne(data.login);
        this.log.verbose(`${user} found in DB`);
        if(!user) user = await this.usersService.create(data);
        return user;
    }

    public async grantTokenPair(data: User) {
        let user = await this.usersService.find(data.id);
        //TODO Ideally any user would go through a /auth/register endpoint insead of just getting added
        if (!user) user = await this.usersService.create(data);
        const token = await this.jwtService.signAsync({login:user.nickname/*, mail:user.email FIXME*/},
        {
            expiresIn: '5m'
        });
        const refreshToken = await this.jwtService.signAsync({login:user.nickname/*, mail:user.email FIXME*/},
        {
            expiresIn: '1h',
            secret: this.env.get<string>('JWT_REFRESH_SECRET')
        });

        this.log.debug(`Grant token pair to: ${user}\nToken: ${token}\nRefresh: ${refreshToken}`);
        return { token, refreshToken };
    }
    
    public async generateTwoFactorAuthenticationSecret(user: User) {
        const secret = authenticator.generateSecret();
    
        const otpauthUrl = authenticator.keyuri(user.nickname, 'AUTH_APP_NAME', secret);
        user.two_factor_auth_secret = secret
        await this.usersService.updateUser(user.id, user)
    
        return {
          secret,
          otpauthUrl
        }
      }

    public async check2FAToken(user: User, token: string) {
        return authenticator.verify({
            token,
            secret: user.two_factor_auth_secret,
          });
      }

    private log:Logger;
}
