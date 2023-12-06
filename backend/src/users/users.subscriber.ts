import {
	DataSource,
	EntitySubscriberInterface,
	EventSubscriber,
	InsertEvent,
	UpdateEvent,
} from 'typeorm';
import { User } from './entities/user.entity';

@EventSubscriber()
export class UsersSubscriber implements EntitySubscriberInterface<User> {
	constructor(dataSource: DataSource) {
		dataSource.subscribers.push(this);
	}

	listenTo() {
		return User;
	}

	beforeUpdate(event: UpdateEvent<User>) {
		console.log(
			`Entity: ${event.entity}\n Columns ${event.updatedColumns}\n Relations ${event.updatedRelations}`,
		);
	}

	beforeInsert(event: InsertEvent<User>) {
		console.log(`BEFORE USER INSERT: `, event.entity);
	}
}
