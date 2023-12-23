import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserRelation } from './entities/userRelations.entity';
import { Channel } from 'src/chat/entities/channel.entity';
import { ChannelMessages } from 'src/chat/entities/message/channel.entity';
import { UserMessages } from 'src/chat/entities/message/user.entity';
import { UsersSubscriber } from './users.subscriber';
import { UsersGateway } from './users.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			User,
			UserRelation,
			Channel,
			ChannelMessages,
			UserMessages
		]),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (env: ConfigService) => ({
				secret: env.get('jwt.secret')
			}),
			inject: [ConfigService]
		})
	],
	controllers: [UsersController],
	providers: [UsersService, UsersSubscriber, UsersGateway],
	exports: [UsersService, UsersGateway]
})
export class UsersModule {}
