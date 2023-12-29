import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { ChatGateway } from './chat.gateway';
import { Channel, MessageType } from './entities/channel.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelPasswordDto } from './dto/channel.password.dto';
import { promisify } from 'util';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { ChannelMuted } from './entities/channel.muted.entity';

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(Channel)
		private readonly channelRepository: Repository<Channel>,
		@InjectRepository(ChannelMuted)
		private readonly channelMutedRepository: Repository<ChannelMuted>,
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
		if (!user) throw new BadRequestException('User not found');
		let users = [];
		if (typeof data.users !== 'undefined') {
			users = await this.userRepository.findByIds(data.users);
			if (!users) throw new BadRequestException('Users not found');
		}
		let channel = await this.channelRepository.findOne({
			where: { name: data.name }
		});
		let tempIV = randomBytes(16);
		if (channel) throw new BadRequestException('Channel name already exists');
		channel = await this.channelRepository.save({
			name: data.name,
			description: data.description,
			IV: tempIV,
			password: await this.encryptstring(data.password, tempIV),
			type: MessageType.CHANNEL,
			owner: user,
			admins: [user],
			banned: [],
			muted: [],
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
		if (typeof data.password !== 'undefined' && data.password !== '')
			data.password = await this.encryptstring(data.password, channel.IV);
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
		else if (channel.owner.id !== userId && user.isAdmin === false)
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
			relations: [
				'users',
				'messages.sender',
				'owner',
				'admins',
				'banned',
				'muted'
			]
		});
		if (!channel) throw new BadRequestException('Channel not found');
		const { password } = await this.channelRepository.findOne({
			where: { id: channelId },
			select: ['password']
		});
		let decryptedPassword = await this.decryptstring(password, channel.IV);
		if (!user) throw new BadRequestException('User not found');
		else if (
			decryptedPassword !== '' &&
			decryptedPassword !== (data?.password ?? '')
		)
			throw new BadRequestException('Invalid password');
		else if (channel.banned.some((u) => u.id === userId))
			throw new BadRequestException('User is banned from channel');
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
		if (!user) throw new BadRequestException('User not found');
		else if (!channel) throw new BadRequestException('Channel not found');
		channel.users = channel.users.filter((u) => u.id !== userId);
		await this.channelRepository.save(channel);
		this.chatGateway.userLeftChannel(userId, channel);
		let channelUsers = await this.channelRepository.findOne({
			where: { id: channelId },
			relations: ['users']
		});
		if (channelUsers.users.length === 0) {
			await this.channelRepository.delete({
				id: channelId
			});
			this.chatGateway.channelDeleted(channel);
		}
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
		if (!user) throw new BadRequestException('User not found');
		else if (!channel) throw new BadRequestException('Channel not found');
		else if (!channel.admins.some((a) => a.id === user.id))
			throw new BadRequestException(
				'You are not allowed to kick users from this channel'
			);
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
		const password = '6QURUCWJ';
		const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
		const decipher = createDecipheriv('aes-256-ctr', key, iv);
		return Buffer.concat([
			decipher.update(todecrypt),
			decipher.final()
		]).toString();
	}

	public async banUserFromChannel(
		userId: number,
		channelId: number,
		bannedUserId: number
	) {
		const user = await this.userRepository.findOne({
			where: { id: userId },
			relations: ['channels']
		});
		let bannedUser = await this.userRepository.findOne({
			where: { id: bannedUserId },
			relations: ['channels']
		});
		const channel = await this.channelRepository.findOne({
			where: { id: channelId },
			relations: ['users', 'admins', 'owner', 'banned']
		});
		if (!user) throw new BadRequestException('User not found');
		else if (!channel) throw new BadRequestException('Channel not found');
		else if (user.id !== channel.owner.id)
			throw new BadRequestException(
				'You are not allowed to ban users from this channel'
			);
		channel.banned = [...channel.banned, bannedUser];
		await this.channelRepository.save(channel);
		this.chatGateway.userBannedChannel(bannedUserId, channel);
		return {
			status: 'success',
			message: 'User banned from channel'
		};
	}

	public async unBanUserFromChannel(
		userId: number,
		channelId: number,
		bannedUserId: number
	) {
		const user = await this.userRepository.findOne({
			where: { id: userId },
			relations: ['channels']
		});
		let bannedUser = await this.userRepository.findOne({
			where: { id: bannedUserId },
			relations: ['channels']
		});
		const channel = await this.channelRepository.findOne({
			where: { id: channelId },
			relations: ['users', 'admins', 'owner', 'banned']
		});
		if (!user) throw new BadRequestException('User not found');
		else if (!channel) throw new BadRequestException('Channel not found');
		else if (user.id !== channel.owner.id)
			throw new BadRequestException(
				'You are not allowed to unban users from this channel'
			);
		channel.banned = channel.banned.filter((u) => u.id !== bannedUserId);
		await this.channelRepository.save(channel);
		this.chatGateway.userUnbannedChannel(bannedUserId, channel);
		return {
			status: 'success',
			message: 'User unbanned from channel'
		};
	}

	public async adminUserFromChannel(
		userId: number,
		channelId: number,
		adminUserId: number
	) {
		const user = await this.userRepository.findOne({
			where: { id: userId },
			relations: ['channels']
		});
		let adminUser = await this.userRepository.findOne({
			where: { id: adminUserId },
			relations: ['channels']
		});
		const channel = await this.channelRepository.findOne({
			where: { id: channelId },
			relations: ['users', 'admins', 'owner', 'banned']
		});
		if (!user) throw new BadRequestException('User not found');
		else if (!channel) throw new BadRequestException('Channel not found');
		else if (user.id !== channel.owner.id)
			throw new BadRequestException(
				'You are not allowed to admin users from this channel'
			);
		channel.admins = [...channel.admins, adminUser];
		await this.channelRepository.save(channel);
		this.chatGateway.userAdminedChannel(adminUserId, channel);
		return {
			status: 'success',
			message: 'User admined from channel'
		};
	}

	public async unAdminUserFromChannel(
		userId: number,
		channelId: number,
		adminUserId: number
	) {
		const user = await this.userRepository.findOne({
			where: { id: userId },
			relations: ['channels']
		});
		let adminUser = await this.userRepository.findOne({
			where: { id: adminUserId },
			relations: ['channels']
		});
		const channel = await this.channelRepository.findOne({
			where: { id: channelId },
			relations: ['users', 'admins', 'owner', 'banned']
		});
		if (!user) throw new BadRequestException('User not found');
		else if (!channel) throw new BadRequestException('Channel not found');
		else if (user.id !== channel.owner.id)
			throw new BadRequestException(
				'You are not allowed to unadmin users from this channel'
			);
		channel.admins = channel.admins.filter((u) => u.id !== adminUserId);
		await this.channelRepository.save(channel);
		this.chatGateway.userUnadminedChannel(adminUserId, channel);
		return {
			status: 'success',
			message: 'User unadmined from channel'
		};
	}

	public async muteUserFromChannel(
		userId: number,
		channelId: number,
		mutedUserId: number,
		time: number
	) {
		const user = await this.userRepository.findOne({
			where: { id: userId },
			relations: ['channels']
		});
		let mutedUser = await this.userRepository.findOne({
			where: { id: mutedUserId },
			relations: ['channels']
		});
		const channel = await this.channelRepository.findOne({
			where: { id: channelId },
			relations: ['users', 'admins', 'owner', 'banned']
		});
		if (!user) throw new BadRequestException('User not found');
		else if (!channel) throw new BadRequestException('Channel not found');
		else if (
			channel.admins.some((a) => a.id === mutedUserId) &&
			mutedUserId === userId
		)
			throw new BadRequestException('You can not mute yourself');
		let channelMuted = new ChannelMuted();
		channelMuted.channel = channel;
		channelMuted.user = mutedUser;
		channelMuted.expire = new Date(Date.now() + time * 60000);
		let muted = await this.channelMutedRepository.save(channelMuted);
		this.chatGateway.userMutedChannel(mutedUserId, channel, muted);
		return {
			status: 'success',
			message: 'User muted from channel'
		};
	}

	public async unMuteUserFromChannel(
		userId: number,
		channelId: number,
		mutedUserId: number
	) {
		const user = await this.userRepository.findOne({
			where: { id: userId },
			relations: ['channels']
		});
		let mutedUser = await this.userRepository.findOne({
			where: { id: mutedUserId },
			relations: ['channels']
		});
		const channel = await this.channelRepository.findOne({
			where: { id: channelId },
			relations: ['users', 'admins', 'owner', 'banned', 'muted']
		});
		if (!user) throw new BadRequestException('User not found');
		else if (!channel) throw new BadRequestException('Channel not found');
		else if (
			channel.admins.some((a) => a.id === mutedUserId) &&
			mutedUserId === userId
		)
			throw new BadRequestException('You can not unmute yourself');
		let channelMutedCopy = channel.muted.find((m) => m.user.id === mutedUserId);
		channel.muted = channel.muted.filter((u) => u.user.id !== mutedUserId);
		this.chatGateway.userUnmutedChannel(mutedUserId, channel);
		await this.channelRepository.save(channel);
		return {
			status: 'success',
			message: 'User unmuted from channel'
		};
	}

	private log: Logger;
}
