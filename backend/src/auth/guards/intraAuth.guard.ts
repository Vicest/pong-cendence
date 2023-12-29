import {
	Injectable,
	ExecutionContext,
	BadRequestException
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class IntraAuthGuard extends AuthGuard('42') {
	constructor() {
		super();
	}

	async canActivate(ec: ExecutionContext): Promise<boolean> {
		const activate: boolean = (await super.canActivate(ec)) as boolean;
		const request = ec.switchToHttp().getRequest();
		await super.logIn(request);
		return activate;
	}

	handleRequest(err, user, info) {
		if (err || !user) {
			throw new BadRequestException(err?.message || info?.message);
		}
		return user;
	}
}
