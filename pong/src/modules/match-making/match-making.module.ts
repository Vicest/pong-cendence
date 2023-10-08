import { Module } from '@nestjs/common'
import { MatchMakingService } from './match-making.service'
import { MatchMakingController } from './match-making.controller'

@Module({
  controllers: [ MatchMakingController ],
  providers: [ MatchMakingService ],
  exports: [],
})
export class MatchMakingModule {}
