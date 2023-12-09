import {
	Body,
	Controller,
	Param,
	Post,
	Get,
	UseGuards,
	Put,
	Req,
	Request,
	UnauthorizedException
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Observable } from 'rxjs';
import { UserMessages } from 'src/chat/entities/message/user.entity';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Channel } from './entities/channel.entity';

@Controller('chat')
@UseGuards(JwtGuard)
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	/* ----------------------------- CHAT ------------------------------ */

	// GET /chat/messages_history
	@Get('messages_history')
	async getMessagesHistory(@Req() req): Promise<UserMessages[] | null> {
		return this.chatService.findUserMessagesHistory(req.user.id);
	}

	// GET /chat/joinedchannels
	@Get('joinedchannels')
	async getChannelsJoined(@Req() req): Promise<Channel[] | null> {
		// console.log('Mensaje canales');
		return this.chatService.findChannelsbyID(req.user.id);
	}

	// GET /chat/unjoinedchannels
	@Get('unjoinedchannels')
	async getChannelsUnJoined(@Req() req): Promise<Channel[] | null> {
		// console.log('Mensaje canales');
		return this.chatService.findChannelswhereimnot(req.user.id);
	}

	// POST /chat/priv_messages
	@Post('priv_messages')
	createPrivateMessages(
		@Body() msg: UserMessages
	): Observable<UserMessages | null> {
		return this.chatService.createUserMessage(msg);
	}
}
