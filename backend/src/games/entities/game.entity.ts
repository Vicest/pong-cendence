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
import { Match } from './match.entity';

@Entity({
	name: 'Games'
})
export class Game {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	description: string;

	@Column({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP'
	})
	created_at: Date;

	@OneToMany(() => Match, (match) => match.game)
	matches: Match[];
}
