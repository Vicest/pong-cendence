import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './users/users.module';
import { GamesModule } from './games/games.module';
import { AuthModule } from './auth/auth.module';
//import { ChatModule } from './chat/chat.module';


@Module({
  imports: [
    //TODO Guarded endpoints fot the IntraAPI limiting, 2/s is what the intra allows for, we would need to adjust values here
    ThrottlerModule.forRoot([{
      ttl: 2000,
      limit: 1,
    }]),
    TypeOrmModule.forRoot({
      //TODO keep CB config in a separate file.
      //import { DBconfig } from './modules/api/orm.config';
      type: 'mysql',
      host: 'db',
      port: 3306,
      username: 'admin',
      password: '1234',
      database: 'transcendence',
      entities: [
        __dirname + '/**/*.entity{.ts,.js}',
      ],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true
    }),
    UsersModule,
    GamesModule,
    AuthModule,
    //ChatModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
