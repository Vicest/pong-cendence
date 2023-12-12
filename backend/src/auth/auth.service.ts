import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { JwtUser } from './auth.interface';

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

	public async decode(jwt: string) {
		return this.jwtService.decode(jwt);
	}

    public async grantTokenPair(data: User, twofastatus: boolean) {
        let user = await this.usersService.find(data.id);
        //TODO Ideally any user would go through a /auth/register endpoint insead of just getting added
        const toSign:JwtUser = {login:user.nickname, isAdmin:user.isAdmin, twofaenabled:user.two_factor_auth_enabled, twofavalidated:twofastatus}
        if (!user) user = await this.usersService.create(data);
        const token = await this.jwtService.signAsync(toSign,
        {
            expiresIn: '6h'
        });
        const refreshToken = await this.jwtService.signAsync(toSign,
        {
            expiresIn: '1h',
            secret: this.env.get<string>('JWT_REFRESH_SECRET')
        });

        this.log.debug(`Grant token pair to: ${user}\nToken: ${token}\nRefresh: ${refreshToken}`);
        return { token, refreshToken };
    }
    
    public async generateTwoFactorAuthenticationSecret(user: User) {
        const secret = authenticator.generateSecret();
    
        const otpauthUrl = authenticator.keyuri(user.nickname, 'Pongscendence', secret);
        user.two_factor_auth_secret = secret
        user.two_factor_auth_enabled = true
        await this.usersService.updateUser(user.id, user)
        return toDataURL(otpauthUrl);
    }

    public async check2FAToken(user: User, token: string) {
        return authenticator.verify({
            token,
            secret: user.two_factor_auth_secret,
          });
      }

    private log:Logger;
}
