import {
	DataSource,
	EntitySubscriberInterface,
	EventSubscriber,
	InsertEvent,
	UpdateEvent
} from 'typeorm';
import { User } from './entities/user.entity';
import { UsersGateway } from './users.gateway';

@EventSubscriber()
export class UsersSubscriber implements EntitySubscriberInterface<User> {
	constructor(
		dataSource: DataSource,
		private readonly usersGateway: UsersGateway
	) {
		dataSource.subscribers.push(this);
	}

	listenTo() {
		return User;
	}

	afterUpdate(event: UpdateEvent<User>) {
		console.log('afterUpdate', event.entity);
		this.usersGateway.server.emit(
			'user:updated',
			event.entity.id,
			event.entity
		);
	}

	afterInsert(event: InsertEvent<User>) {
		this.usersGateway.server.emit(
			'user:created',
			event.entity.id,
			event.entity
		);
	}
}
