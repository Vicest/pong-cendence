import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRelation } from './entities/userRelations.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRelation])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
