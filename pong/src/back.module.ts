import { Module } from '@nestjs/common'
import { GamesModule } from './modules/games/games.module'
import { ChatModule } from './modules/chat/chat.module'
import { MatchMakingModule } from './modules/match-making/match-making.module'

//Cosas de la api
import { ApiModule } from './modules/api/api.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DBconfig } from './modules/api/orm.config'

@Module({
  imports: [
    GamesModule,
    ChatModule,
    MatchMakingModule,
    ApiModule,
    TypeOrmModule.forRoot(DBconfig),
  ],
  controllers: [],
  providers: [],
})
export class BackModule {}
