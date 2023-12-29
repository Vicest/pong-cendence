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
		const match = event.entity;
		console.log('match created', match);
		setTimeout(() => {
			this.gamesGateway.addMatch(match);
		}, 50);
		this.gamesGateway.server.emit('match:created', match.id, match);
	}
}
