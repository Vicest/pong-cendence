import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, OneToOne, PrimaryColumn, JoinTable, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { Channel } from '../channel.entity';

@Entity({
  name: 'ChannelMessages'
})
export class ChannelMessages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text'})
  content: string;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({
    name: 'user_id'
  })
  sender: User;

  @ManyToOne(() => Channel, channel => channel.id)
  @JoinColumn({
    name: 'channel_id'
  })
  receiver: Channel;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;
}