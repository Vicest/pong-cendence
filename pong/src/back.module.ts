import { Module } from '@nestjs/common';
import { GamesModule } from './modules/games/games.module';

//FIXME Just for the serve-static
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

@Module({
  //Serve-static -v-
  imports: [
    GamesModule,
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'debug'),
    // }),
  ],
  //Serve-static -^-
  controllers: [],
  providers: [],
})
export class BackModule {}
