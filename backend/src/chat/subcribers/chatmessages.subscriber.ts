import {
	DataSource,
	EntitySubscriberInterface,
	EventSubscriber,
	InsertEvent,
	UpdateEvent
} from 'typeorm';
import { ChatGateway } from '../gateways/chat.gateway';
import { ChannelMessages } from '../entities/message/channel.entity';

@EventSubscriber()
export class ChatMessagesSubscriber
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
		this.chatGateway.server.emit('chat_msg:updated', event.entity);
		console.log(`ChannelSubscriber: ${event.entity.id} was updated`);
	}

	afterInsert(event: InsertEvent<ChannelMessages>) {
		// this.chatGateway.server
		// 	.to(event.entity.receiver.id.toString())
		// 	.emit('priv_msg:created', event.entity);

		// this.chatGateway.server.emit('chat_msg:created', event.entity);
		console.log(`BEFORE CHANNEL MESSAGE INSERT: `, event.entity);
		event.entity.receiver.members.forEach((user) => {
			this.chatGateway.server
				.to(user.id.toString())
				.emit('chat_msg:created', event.entity);
		});
		// console.log(
		// 	`BEFORE CHANNEL MESSAGE INSERT USERS: `,
		// 	event.entity.receiver.members
		// );
	}
}
