import { Module, forwardRef } from '@nestjs/common';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GamesGateway } from './games.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Match } from './entities/match.entity';
import { MatchEvent } from './entities/events.entity';
import { MatchesSubscriber } from './matches.subscriber';
import { MatchPlayer } from './entities/matchPlayer.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Game, Match, MatchEvent, MatchPlayer, User]),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (env: ConfigService) => ({
				secret: env.get('jwt.secret')
			}),
			inject: [ConfigService]
		}),
		forwardRef(() => ChatModule),
		forwardRef(() => UsersModule)
	],
	controllers: [GamesController],
	providers: [GamesService, GamesGateway, MatchesSubscriber],
	exports: [GamesService]
})
export class GamesModule {}
