import {
	DataSource,
	EntitySubscriberInterface,
	EventSubscriber,
	InsertEvent,
	UpdateEvent
} from 'typeorm';
import { GamesGateway } from './games.gateway';
import { Match } from './entities/match.entity';

@EventSubscriber()
export class MatchesSubscriber implements EntitySubscriberInterface<Match> {
	constructor(
		dataSource: DataSource,
		private readonly gamesGateway: GamesGateway
	) {
		dataSource.subscribers.push(this);
	}

	listenTo() {
		return Match;
	}

	afterUpdate(event: UpdateEvent<Match>) {
		this.gamesGateway.server.emit(
			'match:updated',
			event.entity.id,
			event.entity
		);
	}

	afterInsert(event: InsertEvent<Match>) {
		this.gamesGateway.afterInit(this.gamesGateway.server);
		this.gamesGateway.server.emit(
			'match:created',
			event.entity.id,
			event.entity
		);
	}
}
