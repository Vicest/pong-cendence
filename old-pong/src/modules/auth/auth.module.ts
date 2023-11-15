import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport'
import { IntraAuthGuard } from './intraAuth.guard';
import { Intra42Strategy } from './intra42.strategy';
import { AuthController } from './auth.controller';

@Module({
	imports: [
		PassportModule.register({
			session: false
		})
	],
	controllers: [AuthController],
	providers: [Intra42Strategy, IntraAuthGuard],
	exports: [IntraAuthGuard],
})
export class AuthModule {}
