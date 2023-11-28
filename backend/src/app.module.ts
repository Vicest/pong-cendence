import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    //
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (env:ConfigService) => ({
        type: 'postgres',
        host: env.get<string>('DB_HOST'),
        port: env.get<number>(' DB_PORT'),
        username: env.get<string>('DB_ADMIN'),
        password: env.get<string>('DB_PASS'),
        database: 'transcendence',
        entities: [
          __dirname + '/**/*.entity{.ts,.js}',
        ],
        synchronize: true,

      }),
      inject: [ConfigService]
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
