import { Module } from '@nestjs/common'
import { GamesGateway } from './games.gateway'
import { OngoingGamesService } from './ongoing-games.service'
import { OngoingGamesController } from './games.controller'
import { ApiModule } from '../api/api.module'

@Module({
  imports: [ApiModule],
  controllers: [OngoingGamesController],
  providers: [GamesGateway, OngoingGamesService],
  exports: [GamesGateway],
})
export class GamesModule {}
