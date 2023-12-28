import { Module, forwardRef } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { UsersModule } from '../users/users.module';
import { ChatGateway } from './chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { ChannelMessages } from './entities/channel.message.entity';
import { ChatSubscriber } from './chat.subscriber';
import { GamesModule } from 'src/games/games.module';
import { ChannelMuted } from './entities/channel.muted.entity';

@Module({
	imports: [
		forwardRef(() => UsersModule),
		forwardRef(() => GamesModule),
		TypeOrmModule.forFeature([User, Channel, ChannelMessages, ChannelMuted]),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (env: ConfigService) => ({
				secret: env.get('jwt.secret')
			}),
			inject: [ConfigService]
		})
	],
	providers: [ChatService, ChatGateway, ChatSubscriber],
	controllers: [ChatController],
	exports: [ChatGateway, ChatService]
})
export class ChatModule {}
