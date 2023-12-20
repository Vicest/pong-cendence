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
export class UsersFriendsSubscriber
	implements EntitySubscriberInterface<User['friends']>
{
	constructor(
		dataSource: DataSource,
		private readonly usersGateway: UsersGateway
	) {
		dataSource.subscribers.push(this);
	}

	listenTo() {
		return User['friends'];
	}

	afterUpdate(event: UpdateEvent<User['friends']>) {
		console.log('afterUpdate', event.entity);
	}

	afterInsert(event: InsertEvent<User['friends']>) {
		console.log('afterInsert', event.entity);
	}
}
