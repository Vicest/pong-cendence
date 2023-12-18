import {
	DataSource,
	EntitySubscriberInterface,
	EventSubscriber,
	InsertEvent,
	UpdateEvent,
} from 'typeorm';
import { Channel } from '../entities/channel.entity';
import { ChatGateway } from '../gateways/chat.gateway';

@EventSubscriber()
export class ChatSubscriber implements EntitySubscriberInterface<Channel> {
	constructor(
		dataSource: DataSource,
		private readonly chatGateway: ChatGateway,
		) {
			dataSource.subscribers.push(this);
		}
		
		listenTo() {
			return Channel;
		}
		
		afterUpdate(event: UpdateEvent<Channel>) {
			this.chatGateway.server.emit('channel:updated', event.entity);
			console.log(`ChatSubscriber: ${event.entity.id} was updated`);
		}
		
		afterInsert(event: InsertEvent<Channel>) {
			this.chatGateway.server.emit('channel:created', event.entity);
			console.log(`BEFORE CHANNEL INSERT: `, event.entity);
		}
}