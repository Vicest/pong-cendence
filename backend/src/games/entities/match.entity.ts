import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	JoinTable,
	JoinColumn,
	ManyToOne
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Game } from './game.entity';
import { MatchEvent } from './events.entity';
import { MatchPlayer } from './matchPlayer.entity';

@Entity({
	name: 'Matches'
})
export class Match {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Game, (game) => game.id, { nullable: false })
	@JoinColumn({
		name: 'game_id'
	})
	game: Game;

	@Column({
		type: 'enum',
		enum: ['paused', 'waiting', 'running', 'finished'],
		default: 'waiting'
	})
	status: string;

	@OneToMany(() => MatchPlayer, (matchPlayer) => matchPlayer.match, {
		cascade: ['insert']
	})
	players: MatchPlayer[];

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
