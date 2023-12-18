import {
	DataSource,
	EntitySubscriberInterface,
	EventSubscriber,
	InsertEvent,
	RemoveEvent,
	UpdateEvent,
} from 'typeorm';
import { ChatGateway } from '../gateways/chat.gateway';
import { ChannelMembers } from '../entities/channelmembers.entity';

@EventSubscriber()
export class ChannelMembersSubscriber implements EntitySubscriberInterface<ChannelMembers> {

	constructor(
		dataSource: DataSource,
		private readonly chatGateway: ChatGateway,
	) {
		dataSource.subscribers.push(this);
	}

	listenTo() {
		return ChannelMembers;
	}
	
	beforeRemove(event: RemoveEvent<ChannelMembers>): void | Promise<any> {
		console.log(`BEFORE CHANNELMEMBER MESSAGE REMOVE: `, event);
	
	}

	afterRemove(event: RemoveEvent<ChannelMembers>) : Promise<any> | void{
		this.chatGateway.server.emit('channelmember:deleted', event.entity);
		console.log(`ChannelMemberSubscriber: ${event.entity} was removed`);
	}

	afterUpdate(event: UpdateEvent<ChannelMembers>) {
		this.chatGateway.server.emit('channelmember:updated', event.entity);
		console.log(`ChannelMemberSubscriber: ${event.entity.id} was updated`);
	}

	afterInsert(event: InsertEvent<ChannelMembers>) {
		this.chatGateway.server.emit('channelmember:created', event.entity);
		console.log(`BEFORE CHANNELMEMBER MESSAGE INSERT: `, event.entity);
	}

}