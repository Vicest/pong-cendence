import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	ManyToMany,
	OneToOne,
	PrimaryColumn,
	JoinTable,
	JoinColumn,
	Unique,
	ManyToOne
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Game } from './game.entity';
import { MatchEvent } from './events.entity';

@Entity({
	name: 'Matches'
})
export class Match {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Game, (game) => game.id)
	@JoinColumn({
		name: 'game_id'
	})
	game: Game;

	@Column({
		type: 'enum',
		enum: ['paused', 'waiting', 'running', 'finished']
	})
	status: string;

	@ManyToMany(() => User, (user) => user.id)
	@JoinTable({
		name: 'MatchPlayers',
		joinColumn: {
			name: 'match_id'
		},
		inverseJoinColumn: {
			name: 'user_id'
		}
	})
	players: User[];

	@OneToMany(() => MatchEvent, (event) => event.match)
	@JoinTable({
		name: 'MatchEvents',
		joinColumn: {
			name: 'match_id'
		},
		inverseJoinColumn: {
			name: 'event_id'
		}
	})
	events: MatchEvent[];

	@Column({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP'
	})
	created_at: Date;
}
