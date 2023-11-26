import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './users/users.module';
import { GamesModule } from './games/games.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { SocketsModule } from './sockets/sockets.module';


@Module({
  imports: [
    //TODO Guarded endpoints fot the IntraAPI limiting, 2/s is what the intra allows for, we would need to adjust values here
    ThrottlerModule.forRoot([{
      ttl: 2000,
      limit: 1,
    }]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'postgres',
      password: 'postgress',
      database: 'transcendence',
      entities: [
        __dirname + '/**/*.entity{.ts,.js}',
      ],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      envFilePath: ['../.env'],
      isGlobal: true
    }),
    UsersModule,
    GamesModule,
    AuthModule,
    ChatModule,
    SocketsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
