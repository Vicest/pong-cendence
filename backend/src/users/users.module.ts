import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserRelation } from './entities/userRelations.entity';
import { Channel } from 'src/chat/entities/channel.entity';
import { ChannelMessages } from 'src/chat/entities/message/channel.entity';
import { UserMessages } from 'src/chat/entities/message/user.entity';
import { UsersSubscriber } from './users.subscriber';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			User,
			UserRelation,
			Channel,
			ChannelMessages,
			UserMessages,
		]),
	],
	controllers: [UsersController],
	providers: [UsersService, UsersSubscriber],
	exports: [UsersService],
})
export class UsersModule {}
