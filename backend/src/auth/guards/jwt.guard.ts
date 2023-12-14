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
		if (!['token', 'refreshToken'].some((key) => req.cookies[key])) {
			throw new HttpException('No token or refreshToken', HttpStatus.FORBIDDEN);
		}
		if (err || !user) {
			throw err || new HttpException(info.message, HttpStatus.UNAUTHORIZED);
		}
		return user;
	}
}
