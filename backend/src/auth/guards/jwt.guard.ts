import {
	CanActivate,
	ExecutionContext,
	HttpException,
	HttpStatus,
	Injectable
} from '@nestjs/common';
import { AuthGuard, IAuthModuleOptions } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') implements CanActivate  {
	
	constructor(private readonly reflector: Reflector) {
		super();
	}

	handleRequest(err, user, info, context, status) {
		const req = context.switchToHttp().getRequest();
		const res = context.switchToHttp().getResponse();
		const skipJwtGuard = this.reflector.get<boolean>('skipJwtGuard', context.getHandler());
		if (skipJwtGuard) {
			return true;
		}

		if (!['token', 'refreshToken'].some((key) => req.cookies[key])) {
			throw new HttpException('No token or refreshToken', HttpStatus.FORBIDDEN);
		}
		if (err || !user) {
			if (err && err.message === '2FA not validated') {
				throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
			}
			throw (
				err || new HttpException(info?.message || '', HttpStatus.UNAUTHORIZED)
			);
		}
		return user;
	}

}
