import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { UsersModule } from '../users/users.module';
import { ChatGateway } from './chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { UserRelation } from 'src/users/entities/userRelations.entity';
import { ChannelMessages } from './entities/channel.message.entity';

@Module({
	imports: [
		UsersModule,
		TypeOrmModule.forFeature([User, Channel, UserRelation, ChannelMessages]),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (env: ConfigService) => ({
				secret: env.get('jwt.secret')
			}),
			inject: [ConfigService]
		})
	],
	providers: [ChatService, ChatGateway],
	controllers: [ChatController],
	exports: [ChatGateway]
})
export class ChatModule {}
