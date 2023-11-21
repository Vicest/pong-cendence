import { Entity, Column, ManyToOne, OneToOne,PrimaryColumn , PrimaryGeneratedColumn, JoinColumn} from 'typeorm';
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

    @PrimaryColumn()
    receptor_id: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'receptor_id' })
    receptor: User;
  
    @Column({
      default : 0
    })
    status: number;
}