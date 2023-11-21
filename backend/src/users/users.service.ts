import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository , UpdateResult, DeleteResult} from 'typeorm';
import { Observable, from } from 'rxjs';
import { UserRelation } from './entities/userRelations.entity';
import { ChannelMessages } from 'src/chat/entities/message/channel.entity';
import { Channel } from 'src/chat/entities/channel.entity';
import { channel } from 'diagnostics_channel';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(UserRelation)
        private readonly userRelationRepository: Repository<UserRelation>,
        @InjectRepository(Channel)
        private readonly channelRepository: Repository<Channel>
    ){}
    
        /*Con Dios me disculpo por esta aberracion de función ... 
        pero situaciones drasticas requieren medidas drasticas*/
    async findOneUserById(nickname: string): Promise<User | undefined> {
        let contents = await this.userRepository.findOne({
          where: { nickname },
          relations: ['relationshared', 'relationshared.sender', 'relationshared.receptor', 
            'relationsharedAsReceiver', 'relationsharedAsReceiver.sender', 'relationsharedAsReceiver.receptor',//I hate it
           'channels', 'channels.messages', 'channels.messages.user', 
           'sent_messages', 'sent_messages.sender', 'sent_messages.target',
           'received_messages','received_messages.sender','received_messages.target'] //Puta mierda esta bro :v
        });
      
        if (contents) {
            await contents.loadPrivateMessages();
            await contents.loadrelationsList();
        }
        delete contents.sent_messages;
        delete contents.received_messages;
        delete contents.relationshared;
        delete contents.relationsharedAsReceiver;
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