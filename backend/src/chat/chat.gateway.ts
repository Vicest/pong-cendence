import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	WsException
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
				.leftJoinAndSelect('Channel.owner', 'owner')
				.leftJoinAndSelect('Channel.admins', 'admins')
				.leftJoinAndSelect('Channel.banned', 'banned')
				.leftJoinAndSelect('Channel.muted', 'muted')
				.leftJoinAndSelect('Channel.messages', 'messages')
				.leftJoinAndSelect('messages.sender', 'sender')
				.orderBy('messages.created_at', 'ASC')
				.getMany();
			let notJoinedChannels = channels
				.filter((channel) => {
					return (
						channel.type == 'Channel' &&
						!channel.users.some((user) => {
							return user.id == jwtUser.id;
						})
					);
				})
				.map((channel) => {
					return {
						...channel,
						user: channel.users.find((user) => user.id === jwtUser.id),
						joined: false
					};
				});
			let joinedChannels = channels
				.filter((channel) => {
					return channel.users.some((user) => {
						return user.id == jwtUser.id;
					});
				})
				.map((channel) => {
					return {
						...channel,
						joined: true,
						user:
							channel.type === 'Direct'
								? channel.users.find((user) => user.id !== jwtUser.id)
								: channel.users.find((user) => user.id === jwtUser.id)
					};
				});
			return joinedChannels.concat(notJoinedChannels);
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

	public channelDeleted(channel: Channel) {
		this.server.to('channel_' + channel.id).emit('channel:deleted', channel);
		this.server.sockets.forEach((socket) => {
			socket.leave('channel_' + channel.id);
		});
	}

	public channelUpdated(channel: Channel) {
		this.server.to('channel_' + channel.id).emit('channel:updated', channel);
	}

	public channelCreated(channel: Channel) {
		this.server.sockets.forEach((socket) => {
			if (channel.name === null) {
				channel.users = [];
				socket.join('channel_' + channel.id);
			} else {
				channel.users.forEach((user) => {
					if (socket.data.user.id == user.id) {
						socket.join('channel_' + channel.id);
					}
				});
			}
		});
		this.server.to('channel_' + channel.id).emit('channel:created', channel);
	}

	public userLeftChannel(userId: number, channel: Channel) {
		this.server.to('channel_' + channel.id).emit('channel:left', {
			userId: userId,
			channel
		});
		this.server.sockets.forEach((socket) => {
			if (socket.data.user?.id === userId) {
				socket.leave('channel_' + channel.id);
			}
		});
	}

	public userJoinedChannel(userId: number, channel: Channel) {
		this.server.sockets.forEach((socket) => {
			if (socket.data.user?.id === userId) {
				socket.join('channel_' + channel.id);
			}
		});
		this.server.to('channel_' + channel.id).emit('channel:joined', {
			userId: userId,
			channel
		});
	}

	public userBannedChannel(userId: number, channel: Channel) {
		this.server.to('channel_' + channel.id).emit('channel:banned', {
			userId: userId,
			channel
		});
		this.server.sockets.forEach((socket) => {
			if (socket.data.user?.id === userId) {
				socket.leave('channel_' + channel.id);
			}
		});
	}

	public userUnbannedChannel(userId: number, channel: Channel) {
		this.server.sockets.forEach((socket) => {
			if (socket.data.user?.id === userId) {
				socket.join('channel_' + channel.id);
			}
		});
		this.server.to('channel_' + channel.id).emit('channel:unbanned', {
			userId: userId,
			channel
		});
	}

	public userAdminedChannel(userId: number, channel: Channel) {
		this.server.to('channel_' + channel.id).emit('channel:admined', {
			userId: userId,
			channel
		});
	}

	public userUnadminedChannel(userId: number, channel: Channel) {
		this.server.to('channel_' + channel.id).emit('channel:unadmined', {
			userId: userId,
			channel
		});
	}

	public userMutedChannel(userId: number, channel: Channel) {
		this.server.to('channel_' + channel.id).emit('channel:muted', {
			userId: userId,
			channel
		});
	}

	public userUnmutedChannel(userId: number, channel: Channel) {
		this.server.to('channel_' + channel.id).emit('channel:unmuted', {
			userId: userId,
			channel
		});
	}

	@SubscribeMessage('channel_message')
	async handleChannelMessage(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: { message: string; channel: number }
	) {
		const channel = await this.channelRepository.findOne({
			where: { id: data.channel },
			relations: ['muted', 'banned']
		});
		if (!channel) throw new Error('Channel not found');
		let canSend =
			channel.banned.some((user) => {
				return user.id === client.data.user.id;
			}) &&
			channel.muted.some((user) => {
				return user.id === client.data.user.id;
			})
				? false
				: true;
		if (!canSend) throw new WsException('User cannot send messages');
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
	}

	async handleConnection(@ConnectedSocket() client: Socket, ...args) {
		try {
			const decoded = this.jwtService.verify(this.getAuthCookie(client));
			client.data.user = decoded;
			const chatRooms = await this.getChatRooms(client.data.user);
			for (const room of chatRooms.filter(
				(room) =>
					room.joined &&
					room.banned.map((b) => b.id).indexOf(client.data.user.id) === -1
			)) {
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
