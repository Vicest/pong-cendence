import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class IntraAuthGuard extends AuthGuard('42') {
    async canActivate(ec:ExecutionContext): Promise<boolean> {
        const activate:boolean = await super.canActivate(ec) as boolean;
        const request = ec.switchToHttp().getRequest();
        await super.logIn(request);
        return activate;
    }
}