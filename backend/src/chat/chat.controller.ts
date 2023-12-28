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
import { ChannelPasswordDto } from './dto/channel.password.dto';

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
	async joinChannel(
		@Req() req,
		@Param('id') id: number,
		@Body('data')
		data?: ChannelPasswordDto
	) {
		return await this.chatService.joinChannel(req.user.id, id, data);
	}

	// Post /:id/join
	@Post('/:id/leave')
	async leaveChannel(@Req() req, @Param('id') id: number) {
		return await this.chatService.leaveChannel(req.user.id, id);
	}

	// Post /:id/kick/:userId
	@Post('/:id/kick/:userId')
	async kickUserFromChannel(
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
		return await this.chatService.kickUserFromChannel(req.user.id, id, userId);
	}

	// Post /:id/ban/:userId
	@Post('/:id/ban/:userId')
	async banUserFromChannel(
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
		return await this.chatService.banUserFromChannel(req.user.id, id, userId);
	}

	// Delete /:id/ban/:userId
	@Delete('/:id/ban/:userId')
	async unBanUserFromChannel(
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
		return await this.chatService.unBanUserFromChannel(req.user.id, id, userId);
	}

	// Post /:id/admin/:userId
	@Post('/:id/admin/:userId')
	async adminUserFromChannel(
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
		return await this.chatService.adminUserFromChannel(req.user.id, id, userId);
	}

	// Delete /:id/admin/:userId
	@Delete('/:id/admin/:userId')
	async unAdminUserFromChannel(
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
		return await this.chatService.unAdminUserFromChannel(
			req.user.id,
			id,
			userId
		);
	}

	// Post /:id/mute/:userId
	@Post('/:id/mute/:userId')
	async muteUserFromChannel(
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
		return await this.chatService.muteUserFromChannel(req.user.id, id, userId);
	}

	// Delete /:id/mute/:userId
	@Delete('/:id/mute/:userId')
	async unMuteUserFromChannel(
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
		return await this.chatService.unMuteUserFromChannel(
			req.user.id,
			id,
			userId
		);
	}
}
