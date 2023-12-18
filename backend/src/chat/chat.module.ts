import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { UsersModule } from '../users/users.module';
import { ChatGateway } from './gateways/chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserMessagesSubscriber } from './subcribers/usermessages.subscriber';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { ChannelMessages } from './entities/message/channel.entity';
import { UserMessages } from './entities/message/user.entity';
import { User } from 'src/users/entities/user.entity';
import { ChatMessagesSubscriber } from './subcribers/chatmessages.subscriber';
import { ChatSubscriber } from './subcribers/channel.subscriber';
import { ChannelMembers } from './entities/channelmembers.entity';
import { ChannelMembersSubscriber } from './subcribers/channelmembers.subscriber';

@Module({
	imports: [
		TypeOrmModule.forFeature([User, Channel, ChannelMessages, UserMessages , ChannelMembers]),
		UsersModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (env: ConfigService) => ({
				secret: env.get('jwt.secret')
			}),
			inject: [ConfigService]
		})
	],

	providers: [ChatService, UserMessagesSubscriber, ChatMessagesSubscriber, ChatSubscriber, ChannelMembersSubscriber, ChatGateway],
	controllers: [ChatController],
	exports: [ChatGateway]
})
export class ChatModule {}
