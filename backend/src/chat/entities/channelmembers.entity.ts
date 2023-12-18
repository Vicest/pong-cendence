import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Channel } from './channel.entity';

enum MemberType {
	INVITED = 'Invited',
	BANNED = 'Banned',
	MEMBER = 'Member',
    ADMIN = 'Admin',
    OWNER = 'Owner'
}
//name: 'UserRelations'
@Entity({name: 'ChannelMembers'})
export class ChannelMembers {

    @PrimaryColumn()
	user_id: number;

	@ManyToOne(() => User,{ onDelete: 'NO ACTION' })
	@JoinColumn({ name: 'user_id'})
	user: User;

	@PrimaryColumn()
	channel_id: number;

	@ManyToOne(() => Channel,{ onDelete: 'NO ACTION' })
	@JoinColumn({ name: 'channel_id' })
	channel: Channel;

  @Column({
    type: 'enum',
    enum: MemberType,
    default: MemberType.INVITED
    })
    status: MemberType;

}