import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from './modules/api/api.module';
import { GamesModule } from './modules/games/games.module';
import { AuthModule } from './modules/auth/auth.module';
import { DBconfig } from './modules/api/orm.config';
import { ChatModule } from './modules/chat/chat.module';

@Module({
	imports: [AuthModule, ApiModule, ChatModule, GamesModule, TypeOrmModule.forRoot(DBconfig), ConfigModule.forRoot({ envFilePath: ['.env'], isGlobal: true })],
	controllers: [],
	providers: []
})
export class BackModule {}
