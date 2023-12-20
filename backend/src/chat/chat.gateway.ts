import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Inject, Logger, forwardRef } from '@nestjs/common';
import { ChatService } from './chat.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';

@WebSocketGateway({
	cors: true,
	namespace: 'chats'
})
export class ChatGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	private log: Logger;
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(Channel)
		private readonly channelRepository: Repository<Channel>,
		private jwtService: JwtService,
		@Inject(forwardRef(() => UsersService)) private usersService: UsersService
	) {
		this.log = new Logger();
	}

	@WebSocketServer()
	server: Namespace;

	afterInit(server) {}

	private getAuthCookie(socket: Socket) {
		if (!socket.request.headers?.cookie) {
			throw new Error('Missing cookie header');
		}
		const token = socket.request.headers.cookie
			.split(';')
			.find((cookie) => cookie.trim().startsWith('token='));
		if (!token) throw new Error('Missing token cookie');
		return token.split('=')[1];
	}

	private async getChatRooms(jwtUser: any) {
		try {
			const userBlockedRelations = await this.userRepository.findOne({
				where: { id: jwtUser.id },
				relations: ['blocked']
			});
			const channels = await this.channelRepository
				.createQueryBuilder('Channel')
				.leftJoinAndSelect('Channel.users', 'channels_relation')
				.leftJoinAndSelect('Channel.messages', 'messages')
				.leftJoinAndSelect('messages.sender', 'sender')
				.orderBy('messages.created_at', 'ASC')
				.getMany();
			let notJoinedChannels = channels.filter((channel) => {
				return (
					channel.type == 'Channel' &&
					!channel.users.some((user) => {
						return user.id == jwtUser.id;
					})
				);
			});
			let joinedChannels = channels.filter((channel) => {
				return channel.users.some((user) => {
					return user.id == jwtUser.id;
				});
			});
			return {
				joinedChannels,
				notJoinedChannels
			};
		} catch (error) {
			console.log(error);
		}
	}

	@SubscribeMessage('block_user')
	async handleBlock(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: { user: number }
	) {
		try {
			/*const receptor = await this.userRepository.findOne({
				where: { id: data.user }
			});
			if (!receptor) throw new Error('Receptor not found');
			const relation = await this.userRelationRepository.findOne({
				where: { sender: client.data.user }
			});
			if (!relation) throw new Error('Relation not found');
			relation.status = 0;
			await this.userRelationRepository.save(relation);
			const roomName = [client.data.user.id, receptor.id]
				.sort((a, b) => a - b)
				.join('_');
			this.server.to('user_' + roomName).emit('block_user', relation);*/
		} catch (error) {
			this.log.error(error, this.constructor.name);
		}
	}

	@SubscribeMessage('channel_message')
	async handleChannelMessage(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: { message: string; channel: number }
	) {
		try {
			const channel = await this.channelRepository.findOne({
				where: { id: data.channel }
			});
			if (!channel) throw new Error('Channel not found');
			console.log('channel_' + channel.id);
			const message = await this.usersService.sendChannelMessage(
				client.data.user,
				channel,
				data.message
			);
			this.server.to('channel_' + channel.id).emit('channel_message', {
				channel: channel.id,
				message: message.content,
				sender: client.data.user.id
			});
		} catch (error) {
			this.log.error(error, this.constructor.name);
		}
	}

	async handleConnection(@ConnectedSocket() client: Socket, ...args) {
		try {
			const decoded = this.jwtService.verify(this.getAuthCookie(client));
			client.data.user = decoded;
			const chatRooms = await this.getChatRooms(client.data.user);
			for (const room of chatRooms.joinedChannels) {
				client.join('channel_' + room.id);
			}
			client.emit('rooms', chatRooms);
		} catch (error) {
			client.disconnect();
		}
	}

	handleDisconnect(client: Socket) {
		for (const room of client.rooms) {
			client.leave(room);
		}
		this.log.debug(
			`${client.data.user.login} disconnected`,
			this.constructor.name
		);
	}
}
