import { Entity, Column, ManyToOne, PrimaryColumn , PrimaryGeneratedColumn} from 'typeorm';
import { User } from './user.entity';

@Entity({
    name: 'UserRelations'
  })
export class UserRelation {
    
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.id)
    // @PrimaryColumn({type: 'int'})
    sender: User;
    
    @ManyToOne(() => User, user => user.id)
    // @PrimaryColumn({type: 'int'})
    receptor: User;
    
    @Column({
      default : 0
    })
    status: number;
}