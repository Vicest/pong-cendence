import {
	Entity,
	Column,
	ManyToOne,
	PrimaryColumn,
	JoinColumn,
	OneToMany
} from 'typeorm';
import { User } from './user.entity';

@Entity({
	name: 'UserRelations'
})
export class UserRelation {
	@PrimaryColumn()
	sender_id: number;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'sender_id' })
	sender: User;

	@Column({
		type: 'boolean',
		default: false
	})
	sender_block_status: boolean;

	@PrimaryColumn()
	receptor_id: number;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'receptor_id' })
	receptor: User;

	@Column({
		type: 'boolean',
		default: false
	})
	receiver_block_status: boolean;

	@Column({
		default: 0
	})
	status: number;
}
