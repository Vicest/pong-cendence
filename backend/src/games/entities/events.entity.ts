import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	ManyToMany,
	OneToOne,
	PrimaryColumn,
	JoinTable,
	ManyToOne,
	JoinColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Game } from './game.entity';
import { Match } from './match.entity';

@Entity({
	name: 'MatchEvents'
})
export class MatchEvent {
	@PrimaryGeneratedColumn()
	id: number;

	@OneToOne(() => Match, (match) => match.id)
	@JoinColumn({
		name: 'match_id'
	})
	match: Match;

	@Column({
		type: 'text'
	})
	content: string;

	@ManyToOne(() => User, (user) => user.id)
	@JoinColumn({
		name: 'initiator_id'
	})
	initiator: User;

	@Column({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP'
	})
	created_at: Date;
}
