import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './users/users.module';
import { GamesModule } from './games/games.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';

import databaseConfig from 'config/database';
import jwtConfig from 'config/jwt';
import frontendConfig from 'config/frontend';

@Module({
	imports: [
		//TODO Guarded endpoints fot the IntraAPI limiting, 2/s is what the intra allows for, we would need to adjust values here
		ThrottlerModule.forRoot([
			{
				ttl: 2000,
				limit: 1
			}
		]),
		//
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
		ChatModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
