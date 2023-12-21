import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UsersService } from 'src/users/users.service';
import { ChatService } from './chat.service';

@Controller('chat')
@UseGuards(JwtGuard)
export class ChatController {
	constructor(
		private readonly userService: UsersService,
		private readonly chatService: ChatService,
		private readonly configService: ConfigService
	) {}

	// Post /:id/join
	@Post('/:id/join')
	joinChannel(@Req() req, @Param('id') id: number) {
		return this.chatService.joinChannel(req.user.id, id);
	}
}
