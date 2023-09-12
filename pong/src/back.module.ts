import { Module } from '@nestjs/common';
import { GamesModule } from './modules/games/games.module';

@Module({
  imports: [ GamesModule ],
  controllers: [],
  providers: [],
})
export class BackModule {}
