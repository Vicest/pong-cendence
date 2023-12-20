import {
	DataSource,
	EntitySubscriberInterface,
	EventSubscriber,
	InsertEvent,
	UpdateEvent
} from 'typeorm';
import { ChatGateway } from './chat.gateway';
import { ChannelMessages } from './entities/channel.message.entity';

@EventSubscriber()
export class ChatSubscriber
	implements EntitySubscriberInterface<ChannelMessages>
{
	constructor(
		dataSource: DataSource,
		private readonly chatGateway: ChatGateway
	) {
		dataSource.subscribers.push(this);
	}

	listenTo() {
		return ChannelMessages;
	}

	afterUpdate(event: UpdateEvent<ChannelMessages>) {
		console.log(`UserSubscriber: ${event.entity.id} was updated`);
	}

	afterInsert(event: InsertEvent<ChannelMessages>) {
		console.log(`BEFORE USER INSERT: `, event.entity);
	}
}
