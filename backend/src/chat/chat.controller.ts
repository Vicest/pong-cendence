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
import { Observable, tap } from 'rxjs';
import { UserMessages } from 'src/chat/entities/message/user.entity';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Channel } from './entities/channel.entity';
import { ChannelMessages } from './entities/message/channel.entity';
import { channel } from 'diagnostics_channel';
import { ChannelMembers } from './entities/channelmembers.entity';
import { User } from 'src/users/entities/user.entity';

enum MemberType {
	INVITED = 'Invited',
	BANNED = 'Banned',
	MEMBER = 'Member',
	ADMIN = 'Admin',
	OWNER = 'Owner'
}

enum ChatType {
	PRIVATE = 'Private',
	PROTECTED = 'Protected',
	PUBLIC = 'Public'
}

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

	// GET /chat/channel/:channel_id
	@Get('channel/:channel_id')
	async getChannelbyID(
		@Req() req,
		@Param('channel_id') channel_id: number
	): Promise<Channel> {
		// console.log('Mensaje canales ->', channel_id);
		return (await this.chatService.findChannelsbyUserID(req.user.id)).find(
			(channel) => channel.id == channel_id
		);
	}

	// GET /chat/joinedchannels
	@Get('joinedchannels')
	async getChannelsJoined(@Req() req): Promise<Channel[] | null> {
		// console.log('Mensaje canales');
		return this.chatService.findChannelsbyUserID(req.user.id);
	}

	// GET /chat/unjoinedchannels
	@Get('unjoinedchannels')
	async getChannelsUnJoined(@Req() req): Promise<Channel[] | null> {
		// console.log('Mensaje canales');
		return this.chatService.findChannelswhereimnot(req.user.id);
	}

	// GET /chat/invitations_channels
	@Get('invitations_channels')
	async getChannelInvitations(@Req() req): Promise<Channel[] | null> {
		// console.log('Mensaje canales');
		return this.chatService.findInvitationsChannelsbyID(req.user.id);
	}

	// POST /chat/priv_messages
	@Post('priv_messages')
	createPrivateMessages(
		@Body() msg: UserMessages
	): Observable<UserMessages | null> {
		return this.chatService.createUserMessage(msg);
	}

	// POST /chat/chat_messages
	@Post('chat_messages')
	createChatMessages(
		@Body() msg: ChannelMessages
	): Observable<ChannelMessages | null> {
		return this.chatService.createChatMessage(msg);
	}

	// POST /chat/channel
	@Post('channel')
	createChannel(
		@Body() channel: Channel,
		@Req() req
	): Observable<Channel | null> {
		let result = this.chatService.createChannel(channel).pipe(
			tap((newChannel) => {
				if (newChannel) {
					let relation = this.chatService.createUserChannelRelation(
						req.user.id,
						newChannel.id,
						MemberType.OWNER
					);
					console.log('Mensaje relacion -> ', relation);
				}
			})
		);
		return result;
	}

	async validateRanks(
		operator_id: number,
		afected_id: number,
		channel: Channel
	) {
		let operator_status = (
			await this.chatService.findChannelMember(channel.id, operator_id)
		).status;
		let affected_status = (
			await this.chatService.findChannelMember(channel.id, afected_id)
		).status;

		if (!affected_status || !operator_status) return false;
		if (
			operator_status == MemberType.INVITED ||
			operator_status == MemberType.MEMBER
		)
			return false;
		if (operator_status == MemberType.OWNER) return true;
		if (
			affected_status == MemberType.OWNER ||
			(operator_status == MemberType.ADMIN &&
				affected_status == MemberType.ADMIN)
		)
			return false;
		return true;
	}

	// POST /chat/promote
	@Post('promote')
	async promoteOnChannel(
		@Body() data: [Channel, User],
		@Req() req
	): Promise<ChannelMembers | null> {
		if (!this.validateRanks(req.user.id, data[1].id, data[0])) return null;

		return this.chatService.updateChannelMember(
			data[0].id,
			data[1].id,
			MemberType.ADMIN
		);
	}

	// POST /chat/makeOwner
	@Post('makeOwner')
	async makeOwnerOnChannel(
		@Body() data: [Channel, User],
		@Req() req
	): Promise<ChannelMembers | null> {
		if (!this.validateRanks(req.user.id, data[1].id, data[0])) return null;

		let operator_status = (
			await this.chatService.findChannelMember(data[0].id, data[1].id)
		).status;

		if (operator_status != MemberType.OWNER) return null;
		this.chatService.updateChannelMember(
			data[0].id,
			req.user.id,
			MemberType.ADMIN
		);
		return this.chatService.updateChannelMember(
			data[0].id,
			data[1].id,
			MemberType.OWNER
		);
	}

	// POST /chat/kickFromChannel
	@Post('kickFromChannel')
	async kickFromChannel(
		@Body() data: [Channel, User],
		@Req() req
	): Promise<boolean> {
		if (!this.validateRanks(req.user.id, data[1].id, data[0])) return false;
		return this.chatService.deleteChannelMember(data[0].id, data[1].id);
	}

	// POST /chat/leave_channel
	@Post('leave_channel')
	async leaveChannel(@Body() channel: Channel, @Req() req): Promise<boolean> {
		let result = await this.chatService.findChannelsbyChannelID(channel.id);
		let isMember = await this.chatService.findChannelMember(
			channel.id,
			req.user.id
		);

		console.log('Join chanel Pasa las querys ');
		if (result && isMember && isMember.status != MemberType.BANNED)
			return this.chatService.deleteChannelMember(channel.id, req.user.id);

		return false;
	}

	// POST /chat/join_channel
	@Post('join_channel')
	async joinChannel(
		@Body() channel: Channel,
		@Req() req
	): Promise<ChannelMembers | null> {
		console.log('Join chanel BEGIN ', channel.id, ' - ', req.user.id);
		let relation = null;
		let result = await this.chatService.findChannelsbyChannelID(channel.id);
		let isInvited = await this.chatService.findChannelMember(
			channel.id,
			req.user.id
		);

		console.log('Join chanel Pasa las querys ');
		if (isInvited && isInvited.status == MemberType.INVITED)
			return this.chatService.updateChannelMember(
				channel.id,
				req.user.id,
				MemberType.MEMBER
			);

		console.log('Join chanel Pasa las querys 2');
		if (result) {
			// const foundChannel = result[0];
			console.log('RESULT -> ', result);
			console.log('Contrasena -> ', result.password, ' - ', channel.password);
			if (
				result.type === ChatType.PROTECTED &&
				channel.password === result.password
			) {
				relation = this.chatService.createUserChannelRelation(
					req.user.id,
					channel.id,
					MemberType.MEMBER
				);
			} else if (
				result.type === ChatType.PUBLIC ||
				result.type === ChatType.PRIVATE
			) {
				relation = this.chatService.createUserChannelRelation(
					req.user.id,
					channel.id,
					MemberType.MEMBER
				);
			}
		}

		console.log('INTENTO DE UNIRSE AL CANAL DIO? -> ', relation);
		return relation;
	}

	// POST /chat/accept_invite_channel
	@Post('accept_invite_channel')
	async acceptjoinChannel(
		@Body() channel: Channel,
		@Req() req
	): Promise<ChannelMembers | null> {
		let relation = null;
		let result = await this.chatService.findChannelMember(
			channel.id,
			req.user.id
		);
		if (result) {
			if (result.status == MemberType.INVITED) {
				relation = await this.chatService.updateChannelMember(
					channel.id,
					req.user.id,
					MemberType.MEMBER
				);
			}
		}
		return relation;
	}
}
