import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Channel } from '../../chat/entities/channel.entity';
import { Message } from 'src/chat/entities/message.entity';


@Entity({
  name: 'Users'
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({
    unique: true
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
  twoFactorAuthSecret: string;
  @Column({
    default: false
  })
  twoFactorAuthEnabled: boolean;

  @ManyToMany(() => Channel, (channel) => channel.members)
  channels: Channel[];
}