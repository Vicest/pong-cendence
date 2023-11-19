import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository , UpdateResult, DeleteResult} from 'typeorm';
import { Observable, from } from 'rxjs';
import { UserRelation } from './entities/userRelations.entity';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(UserRelation)
        private readonly userRelationRepository: Repository<UserRelation>
    ){}

    async findOneUserById(nickname: string): Promise<User | undefined> {
        let contents = await this.userRepository.findOne({
            where: { nickname },
            relations: ['relationshared','private_messages','channel_messages']
        });

        // if (contents) {
        //     const relationsWithUsers = contents.relationshared.map(relation => ({
        //         friend = await this.userRepository.findOne({where: { nickname }})
        //     }));
        //     contents.relationshared = relationsWithUsers;
        // }
        console.log(contents);
        return contents;
    }

    createUser(user : User): Observable<User>
    {
        return from(this.userRepository.save(user));
    }

    async getUserWithRelations(nickname: string): Promise<User | undefined> {
        let contents = await this.userRepository.findOne({
            where: { nickname },
            relations: ['relationshared','private_messages','channel_messages']
        });
        console.log(contents);
        return contents;
    }

    createRelationship( user1 : User, user2 : User): Observable<UserRelation>
    {
        const newRelation = new UserRelation();
        newRelation.status = 0;
        newRelation.sender = user1;
        newRelation.receptor = user2;

        return from(this.userRelationRepository.save(newRelation));
    }

}