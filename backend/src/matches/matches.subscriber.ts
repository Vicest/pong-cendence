import {
	DataSource,
	EntitySubscriberInterface,
	EventSubscriber,
	InsertEvent,
	UpdateEvent,
} from 'typeorm';
import { Match } from './entities/match.entity';
import { UsersGateway } from './users.gateway';

@EventSubscriber()
export class MatchesSubscriber implements EntitySubscriberInterface<Match> {
	constructor(
		dataSource: DataSource,
	) {
		dataSource.subscribers.push(this);
	}

	listenTo() {
		return Match;
	}

	//afterUpdate(event: UpdateEvent<User>) {
	//	this.usersGateway.server.emit('user:updated', event.entity);
	//	console.log(`UserSubscriber: ${event.entity.id} was updated`);
	//}
//
	//afterInsert(event: InsertEvent<User>) {
	//	this.usersGateway.server.emit('user:created', event.entity);
	//	console.log(`BEFORE USER INSERT: `, event.entity);
	//}
}
