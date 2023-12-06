import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToMany, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../../users/entities/user.entity';

@Entity({
  name: 'UserMessages'
})
export class UserMessages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text'})
  content: string;

  @ManyToOne(() => User, sender => sender.id)
  @JoinColumn({
    name: 'sender_id'
  })
  sender: User;

  @ManyToOne(() => User, receiver => receiver.id)
  @JoinColumn({
    name: 'receiver_id'
  })
  receiver: User;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  created_at: Date;
}