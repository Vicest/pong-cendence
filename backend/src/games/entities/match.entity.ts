import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	ManyToMany,
	OneToOne,
	PrimaryColumn,
	JoinTable
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

	@OneToOne(() => Game, (game) => game.name)
	game: Game;

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
	events: MatchEvent[];

	@Column({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP'
	})
	created_at: Date;
}
