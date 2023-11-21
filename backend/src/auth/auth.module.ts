import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { IntraAuthGuard } from './intraAuth.guard';
import { Intra42Strategy } from './intra42.strategy';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
	imports: [
		UsersModule,
		PassportModule.register({
			session: false
		}),
		JwtModule.register({
			secret: 'TODO use environment for this',
			signOptions: { expiresIn: '500s' }//TODO smaller
		})
	],
	controllers: [AuthController],
	providers: [Intra42Strategy, IntraAuthGuard, AuthService],
	exports: [IntraAuthGuard],
})
export class AuthModule {}
