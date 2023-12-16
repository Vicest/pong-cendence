import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { IntraAuthGuard } from './guards/intraAuth.guard';
import { Intra42Strategy } from './strategies/intra42.strategy';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtGuard } from './guards/jwt.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshGuard } from './guards/jwtRefresh.guard';
import { JwtRefreshStrategy } from './strategies/jwtRefresh.strategy';
import { AdminGuard } from './guards/admin.guard';
import { AdminStrategy } from './strategies/admin.strategy';

@Module({
	imports: [
		UsersModule,
		PassportModule.register({
			session: false
		}),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (env: ConfigService) => ({
				secret: env.get<string>('JWT_SECRET')
			}),
			inject: [ConfigService]
		}),
		ConfigModule
	],
	controllers: [AuthController],
	providers: [
		AdminStrategy,
		AdminGuard,
		Intra42Strategy,
		IntraAuthGuard,
		JwtStrategy,
		JwtGuard,
		JwtRefreshStrategy,
		JwtRefreshGuard,
		AuthService
	],
	exports: [IntraAuthGuard, AuthService]
})
export class AuthModule {}
