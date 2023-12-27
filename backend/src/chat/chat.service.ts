import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { ChatGateway } from './chat.gateway';
import { Channel, MessageType } from './entities/channel.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(Channel)
		private readonly channelRepository: Repository<Channel>,
		private readonly chatGateway: ChatGateway
	) {
		this.log = new Logger();
	}

	public async createChannel(
		userId: number,
		data: {
			name: string;
			description: string;
			users: number[];
			password?: string;
		}
	) {
		const user = await this.userRepository.findOne({
			where: { id: userId },
			relations: ['channels']
		});
		if (!user) throw new Error('User not found');
		let users = [];
		if (typeof data.users !== 'undefined') {
			users = await this.userRepository.findByIds(data.users);
			if (!users) throw new BadRequestException('Users not found');
		}
		let channel = await this.channelRepository.findOne({
			where: { name: data.name }
		});
		if (channel) throw new BadRequestException('Channel name already exists');
		channel = await this.channelRepository.save({
			name: data.name,
			description: data.description,
			password: data.password,
			type: MessageType.CHANNEL,
			owner: user,
			admins: [user],
			users: [user, ...users],
			hasPassword: typeof data.password !== 'undefined' && data.password !== ''
		});
		this.chatGateway.channelCreated(channel);
		return channel;
	}

	public async updateChannel(userId: number, channelId: number, data: any) {
		const user = await this.userRepository.findOne({
			where: { id: userId },
			relations: ['channels']
		});
		const channel = await this.channelRepository.findOne({
			where: { id: channelId },
			relations: ['owner']
		});
		if (!user) throw new BadRequestException('User not found');
		else if (!channel) throw new BadRequestException('Channel not found');
		else if (channel.owner.id !== userId)
			throw new BadRequestException('You are not the owner of this channel');
		const channelName = await this.channelRepository.findOne({
			where: { name: data.name }
		});
		if (channelName && channelName.id !== channelId)
			throw new BadRequestException('Channel name already exists');
		await this.channelRepository.update(channelId, {
			...data,
			hasPassword: typeof data.password !== 'undefined' && data.password !== ''
		});
		const updatedChannel = await this.channelRepository.findOne({
			where: { id: channelId },
			relations: ['users', 'owner', 'admins']
		});
		this.chatGateway.channelUpdated(updatedChannel);
		return updatedChannel;
	}

	public async deleteChannel(userId: number, channelId: number) {
		const user = await this.userRepository.findOne({
			where: { id: userId },
			relations: ['channels']
		});
		const channel = await this.channelRepository.findOne({
			where: { id: channelId },
			relations: ['owner']
		});
		if (!user) throw new BadRequestException('User not found');
		else if (!channel) throw new BadRequestException('Channel not found');
		else if (channel.owner.id !== userId)
			throw new BadRequestException('You are not the owner of this channel');
		await this.channelRepository.delete(channelId);
		this.chatGateway.channelDeleted(channel);
	}

	public async joinChannel(userId: number, channelId: number) {
		try {
			const user = await this.userRepository.findOne({
				where: { id: userId },
				relations: ['channels']
			});
			const channel = await this.channelRepository.findOne({
				where: { id: channelId },
				relations: ['users', 'messages.sender', 'owner']
			});
			if (!user) throw new BadRequestException('User not found');
			else if (!channel) throw new BadRequestException('Channel not found');
			channel.users.push(user);
			await this.channelRepository.save(channel);
			this.chatGateway.userJoinedChannel(userId, channel);
			return {
				status: 'success',
				message: 'User joined channel'
			};
		} catch (error) {
			this.log.error(error);
			return {
				status: 'error',
				message: error.message
			};
		}
	}

	public async leaveChannel(userId: number, channelId: number) {
		try {
			const user = await this.userRepository.findOne({
				where: { id: userId },
				relations: ['channels']
			});
			const channel = await this.channelRepository.findOne({
				where: { id: channelId },
				relations: ['users']
			});
			if (!user) throw new Error('User not found');
			else if (!channel) throw new Error('Channel not found');
			channel.users = channel.users.filter((u) => u.id !== userId);
			await this.channelRepository.save(channel);
			this.chatGateway.userLeftChannel(userId, channel);
			return {
				status: 'success',
				message: 'User left channel'
			};
		} catch (error) {
			this.log.error(error);
			return {
				status: 'error',
				message: error.message
			};
		}
	}

	public async kickUserFromChannel(
		userId: number,
		channelId: number,
		kickedUserId: number
	) {
		const user = await this.userRepository.findOne({
			where: { id: userId },
			relations: ['channels']
		});
		const channel = await this.channelRepository.findOne({
			where: { id: channelId },
			relations: ['users', 'admins', 'owner']
		});
		if (!user) throw new Error('User not found');
		else if (!channel) throw new Error('Channel not found');
		else if (
			user.id !== channel.owner.id ||
			!channel.admins.some((a) => a.id === user.id)
		)
			throw new Error('You are not allowed to kick users from this channel');
		channel.users = channel.users.filter((u) => u.id !== kickedUserId);
		await this.channelRepository.save(channel);
		this.chatGateway.userLeftChannel(kickedUserId, channel);
		return {
			status: 'success',
			message: 'User kicked from channel'
		};
	}

	private log: Logger;
}
