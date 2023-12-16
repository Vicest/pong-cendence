import {
	DataSource,
	EntitySubscriberInterface,
	EventSubscriber,
	InsertEvent,
	UpdateEvent
} from 'typeorm';
import { Match } from './entities/match.entity';
import { GamesGateway } from './games.gateway';

@EventSubscriber()
export class UsersSubscriber implements EntitySubscriberInterface<Match> {
	constructor(
		dataSource: DataSource,
		private readonly gamesGateway: GamesGateway
	) {
		dataSource.subscribers.push(this);
	}

	listenTo() {
		return Match;
	}

	afterInsert(event: InsertEvent<Match>) {
		this.gamesGateway.server.emit(
			'match:created',
			event.entity.id,
			event.entity
		);
	}
}
