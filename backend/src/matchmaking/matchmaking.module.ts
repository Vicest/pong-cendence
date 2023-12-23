import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { MatchMakingController } from './matchmaking.controller';
import { MatchMakingService } from './matchmaking.service';
import { MatchMakingGateway } from './matchmaking.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GamesModule } from 'src/games/games.module';

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (env: ConfigService) => ({
				secret: env.get('jwt.secret')
			}),
			inject: [ConfigService]
		}),
		UsersModule,
		GamesModule,
		AuthModule
	],
	controllers: [MatchMakingController],
	providers: [MatchMakingService, MatchMakingGateway],
	exports: [MatchMakingGateway, MatchMakingService]
})
export class MatchMakingModule {}
