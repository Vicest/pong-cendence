import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, OneToOne, PrimaryColumn, JoinTable } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Message } from './message.entity';
@Entity({
  name: 'Channels'
})
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  password: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  created_at: Date;

  @ManyToMany(() => User, user => user.id)
  @JoinTable({
    name: 'ChannelMembers',
  })
  members: User[];

}