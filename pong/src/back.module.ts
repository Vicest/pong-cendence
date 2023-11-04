import { Module } from '@nestjs/common';

//Cosas de la api
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from './modules/api/api.module';
import { GamesModule } from './modules/games/games.module';
import { DBconfig } from './modules/api/orm.config';
import { ChatModule } from './modules/chat/chat.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
	imports: [ApiModule, ChatModule, GamesModule, TypeOrmModule.forRoot(DBconfig)],
	controllers: [],
	providers: []
})
export class BackModule {

}
