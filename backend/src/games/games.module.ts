import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GamesGateway } from './games.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Match } from './entities/match.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([Game, Match]),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (env: ConfigService) => ({
				secret: env.get('jwt.secret')
			}),
			inject: [ConfigService]
		})
	],
	controllers: [GamesController],
	providers: [GamesService, GamesGateway]
})
export class GamesModule {}
