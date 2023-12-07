import { Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import jwtConfiguration from 'config/jwt';

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private usersService: UsersService,
		@Inject(jwtConfiguration.KEY)
		private jwtConfig: ConfigType<typeof jwtConfiguration>
	) {
		this.log = new Logger();
	}

	//is valid, already exists, create, error, etc.
	public async validateUser(data): Promise<User | null> {
		let user: User | null = await this.usersService.find(data.id);
		if (!user) user = await this.usersService.create(data);
		return user;
	}

	public async grantTokenPair(data: User) {
		let user = await this.usersService.find(data.id);
		//TODO Ideally any user would go through a /auth/register endpoint insead of just getting added
		if (!user) user = await this.usersService.create(data);
		const token = await this.jwtService.signAsync(
			{ login: user.login, id: user.id /*, mail:user.email FIXME*/ },
			{
				expiresIn: this.jwtConfig.expiresIn,
				secret: this.jwtConfig.secret
			}
		);
		const refreshToken = await this.jwtService.signAsync(
			{ login: user.login, id: user.id /*, mail:user.email FIXME*/ },
			{
				expiresIn: this.jwtConfig.refreshExpiresIn,
				secret: this.jwtConfig.refreshSecret
			}
		);

		this.log.debug(
			`Grant token pair to: ${user}\nToken: ${token}\nRefresh: ${refreshToken}`
		);
		return { token, refreshToken };
	}

	private log: Logger;
}
