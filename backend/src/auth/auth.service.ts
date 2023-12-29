import {
	BadRequestException,
	Inject,
	Injectable,
	Logger
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import jwtConfiguration from 'config/jwt';
import { JwtUser } from './auth.interface';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { promisify } from 'util';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';

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
		let user: User | null = await this.usersService.findOne(data.login);
		if (!user) user = await this.usersService.create(data);
		if (user.isBanned) throw new BadRequestException('User is banned');
		return user;
	}

	public async decode(jwt: string) {
		return this.jwtService.decode(jwt);
	}

	public async grantTokenPair(data: User, twofastatus: boolean) {
		let user = await this.usersService.findOne(data.login);
		//TODO Ideally any user would go through a /auth/register endpoint insead of just getting added
		if (!user) user = await this.usersService.create(data);
		const toSign: JwtUser = {
			login: user.login,
			id: user.id,
			isAdmin: user.isAdmin,
			twofaenabled: user.two_factor_auth_enabled,
			twofavalidated: twofastatus,
			created_at: user.created_at,
			iv: user.IV
		};
		const token = await this.jwtService.signAsync(toSign, {
			expiresIn: this.jwtConfig.expiresIn,
			secret: this.jwtConfig.secret
		});
		const refreshToken = await this.jwtService.signAsync(toSign, {
			expiresIn: this.jwtConfig.refreshExpiresIn,
			secret: this.jwtConfig.refreshSecret
		});
		this.log.debug(`Token granted for ${user.login}`, this.constructor.name);
		return { token, refreshToken };
	}

	public async twofachangestatus(user: User, token: string) {
		if ((await this.check2FAToken(user, token)) == true) {
			if (user.two_factor_auth_enabled == true) {
				user.two_factor_auth_enabled = false;
				user.two_factor_auth_secret = null;
			} else {
				user.two_factor_auth_enabled = true;
			}
			await this.usersService.updateUser(user.id, user);
		}
	}
	public async generateTwoFactorAuthenticationSecret(user: User) {
		const secret = authenticator.generateSecret();
		const otpauthUrl = authenticator.keyuri(
			user.nickname,
			'Pongscendence',
			secret
		);
		let iv = randomBytes(16);
		if (user.IV == null) {
			user.IV = iv;
		} else {
			iv = user.IV;
		}
		user.two_factor_auth_secret = await this.encryptstring(secret, iv);
		await this.usersService.updateUser(user.id, user);
		return toDataURL(otpauthUrl);
	}

	public async check2FAToken(user: User, token: string) {
		return authenticator.verify({
			token,
			secret: await this.decryptstring(user.two_factor_auth_secret, user.IV)
		});
	}

	public async encryptstring(toencrypt: string, iv: Buffer) {
		const password = '6QURUCWJ';
		const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
		const cipher = createCipheriv('aes-256-ctr', key, iv);
		return Buffer.concat([cipher.update(toencrypt), cipher.final()]);
	}

	public async decryptstring(todecrypt: Buffer, iv: Buffer) {
		const password = '6QURUCWJ';
		const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
		const decipher = createDecipheriv('aes-256-ctr', key, iv);
		return Buffer.concat([
			decipher.update(todecrypt),
			decipher.final()
		]).toString();
	}

	private log: Logger;
}
