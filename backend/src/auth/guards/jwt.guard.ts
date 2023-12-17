import {
	ExecutionContext,
	HttpException,
	HttpStatus,
	Injectable
} from '@nestjs/common';
import { AuthGuard, IAuthModuleOptions } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
	handleRequest(err, user, info, context, status) {
		const req = context.switchToHttp().getRequest();
		const res = context.switchToHttp().getResponse();
		if (!['token', 'refreshToken'].some((key) => req.cookies[key])) {
			throw new HttpException('No token or refreshToken', HttpStatus.FORBIDDEN);
		}
		if (err || !user) {
			if (err && err.message === '2FA not validated') {
				throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
			}
			throw err || new HttpException(info.message, HttpStatus.UNAUTHORIZED);
		}
		return user;
	}
}
