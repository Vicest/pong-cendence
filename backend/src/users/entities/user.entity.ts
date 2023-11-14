import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Channel } from '../../chat/entities/channel.entity';
import { UserMessages } from 'src/chat/entities/message/user.entity';
import { ChannelMessages } from 'src/chat/entities/message/channel.entity';


@Entity({
  name: 'Users'
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({
    unique: true,
    length: 20
  })
  nickname: string;

  @Column({
    unique: true
  })
  email: string;

  @Column({
    nullable: true,
    default: null
  })
  avatar: string;

  @Column({
    nullable: true,
    default: null
  })
  two_factor_auth_secret: string;

  @Column({
    default: false
  })
  two_factor_auth_enabled: boolean;

  @ManyToMany(() => Channel, (channel) => channel.members)
  channels: Channel[];

  @OneToMany(() => ChannelMessages, message => message.user)
  channel_messages: ChannelMessages[];

  @OneToMany(() => UserMessages, message => (message.sender || message.target))
  private_messages: UserMessages[];
}