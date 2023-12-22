import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	HttpException,
	HttpStatus,
	Param,
	Post,
	Put,
	Req,
	UseGuards
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UsersService } from 'src/users/users.service';
import { ChatService } from './chat.service';
import { Channel } from './entities/channel.entity';
import { ChannelCreateDto } from './dto/create.channel.dto';
import { UpdateCreateDto } from './dto/update.channel.dto';

@Controller('chat')
@UseGuards(JwtGuard)
export class ChatController {
	constructor(
		private readonly userService: UsersService,
		private readonly chatService: ChatService,
		private readonly configService: ConfigService
	) {}

	// Post /
	@Post('/')
	async createChannel(
		@Req() req,
		@Body('data')
		data: ChannelCreateDto
	) {
		return await this.chatService.createChannel(req.user.id, data);
	}

	// Put /:id
	@Put('/:id')
	async updateChannel(
		@Req() req,
		@Body()
		data: UpdateCreateDto,
		@Param('id', {
			transform: (value) => {
				const channelId = parseInt(value);
				if (isNaN(channelId))
					throw new BadRequestException('Invalid channel id');
				return channelId;
			}
		})
		id: number
	) {
		return await this.chatService.updateChannel(req.user.id, id, data);
	}

	// Post /:id/join
	@Delete('/:id')
	async deleteChannel(@Req() req, @Param('id') id: number) {
		return await this.chatService.deleteChannel(req.user.id, id);
	}

	// Post /:id/join
	@Post('/:id/join')
	joinChannel(@Req() req, @Param('id') id: number) {
		return this.chatService.joinChannel(req.user.id, id);
	}

	// Post /:id/join
	@Post('/:id/leave')
	leaveChannel(@Req() req, @Param('id') id: number) {
		return this.chatService.leaveChannel(req.user.id, id);
	}

	// Post /:id/kick/:userId
	@Post('/:id/kick/:userId')
	kickUserFromChannel(
		@Req() req,
		@Param('id') id: number,
		@Param('userId', {
			transform: (value) => {
				const userId = parseInt(value);
				if (isNaN(userId)) throw new BadRequestException('Invalid user id');
				return userId;
			}
		})
		userId: number
	) {
		return this.chatService.kickUserFromChannel(req.user.id, id, userId);
	}
}
