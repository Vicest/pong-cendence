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
	title: string;

	@Column()
	image: string;

	@Column()
	creator: string;

	@Column({
		type: 'timestamp'
	})
	launched_at: Date;

	@Column()
	description: string;

	@Column({
		default: true
	})
	enabled: boolean;

	@Column({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP'
	})
	created_at: Date;

	@OneToMany(() => Match, (match) => match.game)
	matches: Match[];
}
