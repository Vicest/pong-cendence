import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, OneToOne, PrimaryColumn, JoinTable } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ChannelMessages } from './message/channel.entity';

@Entity({
  name: 'Channels'
})
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nickname: string;

  @Column()
  description: string;

  @Column()
  password: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  created_at: Date;

  @ManyToMany(() => User, user => user.channels)
  @JoinTable({
    name: 'ChannelMembers',
    joinColumn: {
      name: 'channel_id'
    },
    inverseJoinColumn: {
      name: 'user_id'
    }
  })
  members: User[];

  @OneToMany(() => ChannelMessages, message => message.receiver)
  messages: ChannelMessages[];
  
}
