import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { MatchMakingController } from './matchmaking.controller';
import { MatchMakingService } from './matchmaking.service';
import { MatchMakingGateway } from './matchmaking.gateway';
import { JwtModule } from '@nestjs/jwt';

@Module({
	imports: [
		JwtModule,
		UsersModule,
		AuthModule,
	],
	controllers: [MatchMakingController],
	providers: [MatchMakingService, MatchMakingGateway]
})
export class MatchMakingModule {}
