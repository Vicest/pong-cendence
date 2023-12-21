import { Injectable, Logger } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { ChatGateway } from './chat.gateway';
import { Channel } from './entities/channel.entity';
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

	public async joinChannel(userId: number, channelId: number) {
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

	private log: Logger;
}
