import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, OneToOne, PrimaryColumn, JoinTable, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { Channel } from '../channel.entity';

@Entity({
  name: 'ChannelMessages'
})
export class ChannelMessages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'longtext'})
  content: string;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({
    name: 'user_id'
  })
  user: User;

  @ManyToOne(() => Channel, channel => channel.id)
  @JoinColumn({
    name: 'channel_id'
  })
  channel: Channel;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;
}