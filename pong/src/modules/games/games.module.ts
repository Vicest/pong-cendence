import { Module } from '@nestjs/common';
import { GamesGateway } from './games.gateway';
import { MatchMakingService } from './match-making.service';
import { OngoingGamesService } from './ongoing-games.service';

@Module({
  controllers: [],
  providers: [GamesGateway, MatchMakingService, OngoingGamesService],
  exports: [GamesGateway],
})
export class GamesModule {}
