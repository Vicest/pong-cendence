import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GamesGateway } from './games.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Match } from './entities/match.entity';
import { MatchEvent } from './entities/events.entity';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { MatchesSubscriber } from './matches.subscriber';

@Module({
	imports: [
		UsersModule,
		AuthModule,
		TypeOrmModule.forFeature([Game, Match, MatchEvent]),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (env: ConfigService) => ({
				secret: env.get('jwt.secret')
			}),
			inject: [ConfigService]
		})
	],
	controllers: [GamesController],
	providers: [GamesService, GamesGateway, MatchesSubscriber]
})
export class GamesModule {}
