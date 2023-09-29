import { Module } from '@nestjs/common';
import { GamesGateway } from './games.gateway';
import { MatchMakingService } from './match-making.service';//FIXME Still here?
import { OngoingGamesService } from './ongoing-games.service';
import { OngoingGamesController } from './games.controller';

@Module({
  controllers: [OngoingGamesController],
  providers: [GamesGateway, MatchMakingService, OngoingGamesService],
  exports: [GamesGateway],
})
export class GamesModule {}
