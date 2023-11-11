import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, OneToOne, PrimaryColumn, JoinTable } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Channel } from './channel.entity';
@Entity({
  name: 'Messages'
})
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

    @OneToOne(() => User, user => user.id)
    user: User;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  created_at: Date;

  @OneToOne(() => Channel, channel => channel.id)
 channel: Channel;
}