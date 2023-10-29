import { Module } from '@nestjs/common';

//Cosas de la api
import { ApiModule } from './modules/api/api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesModule } from './modules/games/games.module';
import { DBconfig } from './modules/api/orm.config';

@Module({
	imports: [ApiModule, GamesModule, TypeOrmModule.forRoot(DBconfig)],
	controllers: [],
	providers: []
})
export class BackModule {}
