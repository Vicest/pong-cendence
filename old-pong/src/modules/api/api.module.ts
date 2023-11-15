import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {  User , Friend, Channels, Match, Subscription } from './orm.entity';

//, Friend, Channels, Match, Subscription
@Module({
  imports: [TypeOrmModule.forFeature([User, Friend, Channels, Match, Subscription])],
  controllers: [ApiController],
  providers: [ApiService],
  exports: [ApiService]
})
export class ApiModule {}
