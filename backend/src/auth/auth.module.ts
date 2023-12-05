import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { IntraAuthGuard } from './intraAuth.guard';
import { Intra42Strategy } from './intra42.strategy';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { Serializer } from './Serializer';
import { JwtGuard } from './jwt.guard';
import { JwtStrategy } from './jwt.strategy';
import { JwtRefreshGuard } from './jwtRefresh.guard';
import { JwtRefreshStrategy } from './jwtRefresh.strategy';
import { AdminGuard } from './admin.guard';
import { AdminStrategy } from './admin.strategy';

@Module({
	imports: [
		UsersModule,
		PassportModule.register({
			session: true//TODO enable sessions eventially
		}),
		JwtModule.registerAsync({
      		imports: [ConfigModule],
			useFactory: (env:ConfigService) => ({
				secret: env.get<string>('JWT_SECRET')
			}),
			inject: [ConfigService],
		})
	],
	controllers: [AuthController],
	providers: [AdminStrategy, AdminGuard, Intra42Strategy, IntraAuthGuard, JwtStrategy, JwtGuard, JwtRefreshStrategy, JwtRefreshGuard, AuthService, Serializer],
	exports: [IntraAuthGuard],
})
export class AuthModule {}
