import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { UsersModule } from '../users/users.module';
import { ChatGateway } from './chat.gateway';
import { UsersService } from 'src/users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChatSubscriber } from './chat.subscriber';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { ChannelMessages } from './entities/message/channel.entity';
import { UserMessages } from './entities/message/user.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([User, Channel, ChannelMessages, UserMessages]),
		UsersModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (env: ConfigService) => ({
				secret: env.get('jwt.secret')
			}),
			inject: [ConfigService]
		})
	],

	providers: [ChatService, ChatSubscriber, ChatGateway],
	controllers: [ChatController],
	exports: [ChatGateway]
})
export class ChatModule {}
