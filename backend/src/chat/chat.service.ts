import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { ChatGateway } from './chat.gateway';
import { Channel, MessageType } from './entities/channel.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelPasswordDto } from './dto/channel.password.dto';
import { promisify } from 'util';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';

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
			password: await this.encryptstring(data.password, channel.IV),
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

	public async joinChannel(
		userId: number,
		channelId: number,
		data?: ChannelPasswordDto
	) {
		const user = await this.userRepository.findOne({
			where: { id: userId },
			relations: ['channels']
		});
		const channel = await this.channelRepository.findOne({
			where: { id: channelId },
			relations: ['users', 'messages.sender', 'owner']
		});
		let channelPassword = await this.channelRepository.findOne({
			where: { id: channelId },
			select: ['password']
		});
		if (!user) throw new BadRequestException('User not found');
		else if (!channel) throw new BadRequestException('Channel not found');
		else if (
			typeof data !== 'undefined' &&
			channelPassword.password !== await this.encryptstring(data.password, channel.IV)
		)
			throw new BadRequestException('Invalid password');
		else if (channel.users.some((u) => u.id === userId))
			throw new BadRequestException('User already joined channel');
		channel.users.push(user);
		await this.channelRepository.save(channel);
		this.chatGateway.userJoinedChannel(userId, channel);
		return {
			status: 'success',
			message: 'User joined channel'
		};
	}

	public async leaveChannel(userId: number, channelId: number) {
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

	public async encryptstring(toencrypt: string, iv: Buffer) {
		const password = '6QURUCWJ';
		const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
		const cipher = createCipheriv('aes-256-ctr', key, iv);
		return Buffer.concat([cipher.update(toencrypt), cipher.final()]);
	}

	public async decryptstring(todecrypt: Buffer, iv: Buffer) {
		console.log('decrypt:', todecrypt);
		const password = '6QURUCWJ';
		const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
		const decipher = createDecipheriv('aes-256-ctr', key, iv);
		return Buffer.concat([
			decipher.update(todecrypt),
			decipher.final()
		]).toString();
	}

	private log: Logger;
}