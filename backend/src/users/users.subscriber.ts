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
	private user: User;

	constructor(
		dataSource: DataSource,
		private readonly usersGateway: UsersGateway
	) {
		dataSource.subscribers.push(this);
	}

	listenTo() {
		return User;
	}

	afterLoad(user: User) {
		this.user = user;
	}

	afterUpdate(event: UpdateEvent<User>) {
		this.usersGateway.server.emit('user:updated', this.user?.id, event.entity);
	}

	afterInsert(event: InsertEvent<User>) {
		this.usersGateway.server.emit('user:created', event.entity);
	}
}
