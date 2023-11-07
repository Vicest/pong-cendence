import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from './modules/api/api.module';
import { GamesModule } from './modules/games/games.module';
import { AuthModule } from './modules/auth/auth.module';
import { DBconfig } from './modules/api/orm.config';
import { ChatModule } from './modules/chat/chat.module';

@Module({
	imports: [ApiModule, ApiModule, ChatModule, GamesModule, TypeOrmModule.forRoot(DBconfig)],
	controllers: [],
	providers: []
})
export class BackModule {}
