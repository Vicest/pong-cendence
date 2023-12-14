import {
	DataSource,
	EntitySubscriberInterface,
	EventSubscriber,
	InsertEvent,
	UpdateEvent,
} from 'typeorm';
import { UserMessages } from './entities/message/user.entity';
import { ChatGateway } from './chat.gateway';

@EventSubscriber()
export class ChatSubscriber implements EntitySubscriberInterface<UserMessages> {
	constructor(
		dataSource: DataSource,
		private readonly chatGateway: ChatGateway,
	) {
		dataSource.subscribers.push(this);
	}

	listenTo() {
		return UserMessages;
	}

	afterUpdate(event: UpdateEvent<UserMessages>) {
		this.chatGateway.server.emit('priv_msg:updated', event.entity);
		console.log(`UserSubscriber: ${event.entity.id} was updated`);
	}

	afterInsert(event: InsertEvent<UserMessages>) {
		this.chatGateway.server.emit('priv_msg:created', event.entity);
		console.log(`BEFORE USER INSERT: `, event.entity);
	}
}