import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Channel } from 'src/chat/entities/channel.entity';
import { UsersSubscriber } from './users.subscriber';
import { UsersGateway } from './users.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChannelMessages } from 'src/chat/entities/channel.message.entity';
import { ChatModule } from 'src/chat/chat.module';
import { Game } from 'src/games/entities/game.entity';
import { Match } from 'src/games/entities/match.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([User, Match, Channel, ChannelMessages, Game]),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (env: ConfigService) => ({
				secret: env.get('jwt.secret')
			}),
			inject: [ConfigService]
		}),
		forwardRef(() => ChatModule)
	],
	controllers: [UsersController],
	providers: [UsersService, UsersSubscriber, UsersGateway],
	exports: [UsersService]
})
export class UsersModule {}
