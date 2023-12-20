import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { UsersModule } from './users/users.module';
import { GamesModule } from './games/games.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';

import databaseConfig from 'config/database';
import jwtConfig from 'config/jwt';
import frontendConfig from 'config/frontend';
import { ScheduleModule } from '@nestjs/schedule';
import { MatchMakingModule } from './matchmaking/matchmaking.module';
import { APP_FILTER } from '@nestjs/core';



import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

@Catch(HttpException)
export class RateLimitFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

	return response.redirect(process.env.BACKEND_BASE+ ":"+process.env.FRONTEND_PORT + '/login');

  }
}
@Module({
	imports: [
		ScheduleModule.forRoot(),
		ThrottlerModule.forRoot([
			{
				ttl: 1000,
				limit: 1
			}
		]),
		
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (env: ConfigService) => ({
				type: 'postgres',
				host: 'postgres',
				port: env.get('database.port'),
				username: env.get('database.username'),
				password: env.get('database.password'),
				database: env.get('database.database'),
				entities: [__dirname + '/**/*.entity{.ts,.js}'],
				synchronize: true
			}),
			inject: [ConfigService]
		}),
		ConfigModule.forRoot({
			load: [databaseConfig, jwtConfig, frontendConfig],
			isGlobal: true
		}),
		UsersModule,
		GamesModule,
		AuthModule,
		ChatModule,
		MatchMakingModule
	],
	providers: [
		{
		  provide: APP_FILTER,
		  useClass: RateLimitFilter,
		},
	  ],
})
export class AppModule {}
