import {
	DataSource,
	EntitySubscriberInterface,
	EventSubscriber,
	InsertEvent,
	UpdateEvent
} from 'typeorm';
import { ChatGateway } from './chat.gateway';
import { Channel } from './entities/channel.entity';
import { channel } from 'diagnostics_channel';

@EventSubscriber()
export class ChatSubscriber implements EntitySubscriberInterface<Channel> {
	constructor(
		dataSource: DataSource,
		private readonly chatGateway: ChatGateway
	) {
		dataSource.subscribers.push(this);
	}

	listenTo() {
		return Channel;
	}
}
