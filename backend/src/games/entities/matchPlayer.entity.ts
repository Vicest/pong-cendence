import {
	Entity,
	Column,
	ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Match } from './match.entity';

@Entity({
	name: 'MatchPlayer'
})
export class MatchPlayer {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.id)
    user: User;

    @ManyToOne(() => Match, (match) => match.id)
    match: Match;

	@Column({
		type: 'int',
		default: 0
	})
	rankShift: number;

	@Column({
		type: 'boolean',
		default: false
	})
	isWinner: boolean;
}