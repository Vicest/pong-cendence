import { Injectable, Logger } from '@nestjs/common';
import { User } from './entities/user.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository , UpdateResult, DeleteResult} from 'typeorm';
import { Observable, from } from 'rxjs';
import { UserRelation } from './entities/userRelations.entity';
import { ChannelMessages } from 'src/chat/entities/message/channel.entity';
import { UserMessages } from 'src/chat/entities/message/user.entity';
import { Channel } from 'src/chat/entities/channel.entity';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) 
        private  readonly userRepository: Repository<User>,
        @InjectRepository(UserRelation)
        private readonly userRelationRepository: Repository<UserRelation>,
        @InjectRepository(ChannelMessages)
        private readonly channelmessagesRepository: Repository<ChannelMessages>,
        @InjectRepository(UserMessages)
        private readonly usermessagesRepository: Repository<UserMessages>
    ){this.log = new Logger;}

    //TODO I suspect that create simply returns User or some sort of error.
    public async create(data): Promise<User|null> {
        console.log("Creating user", data.login);
        let fields = JSON.parse(data._raw);
        const newUser:User|null = await this.userRepository.create({nickname:data.login, isRegistered:false, avatar:fields.image?.link});
        this.log.debug(`Created user ${newUser}`)
        if (newUser) await this.userRepository.save(newUser);
        return newUser;
    }

    public async updateUser(id: number, user: Partial<User>): Promise<User>
    {
        await this.userRepository.update(id, user);
        return this.userRepository.findOne({ where: { id } });
    }

    public async find(id:number): Promise<User|null> {
        return this.userRepository.findOneBy({ id:id });
    }

    public async findAll(): Promise<User[]> {  
        return this.userRepository.find();
    
    }

    public async findOne(login:string): Promise<User|null> {
        return this.userRepository.findOneBy({ nickname:login });
    }
    
    private log:Logger;

    
    
        /*Con Dios me disculpo por esta aberracion de función ... 
        pero situaciones drasticas requieren medidas drasticas*/
    async findOneUserById(nickname: string): Promise<User | undefined> {
        let contents = await this.userRepository.findOne({
          where: { nickname },
          relations: ['relationshared', 'relationshared.sender', 'relationshared.receptor', 
            'relationsharedAsReceiver', 'relationsharedAsReceiver.sender', 'relationsharedAsReceiver.receptor',//I hate it
           'channels', 'channels.messages', 'channels.messages.sender', 'channels.members', 
           'sent_messages', 'sent_messages.sender', 'sent_messages.receiver',
           'received_messages','received_messages.sender','received_messages.receiver'] //Puta mierda esta bro :v
        });
      
        if (contents) {
            await contents.loadPrivateMessages();
            await contents.loadrelationsList();
            contents.friends = contents.relationsList
                .filter((relation) => relation.status === 1)
                .map((relation) => (relation.sender_id === contents.id ? relation.receptor : relation.sender));
        }
        delete contents._relationList;
        delete contents.sent_messages;
        delete contents.received_messages;
        delete contents.relationshared;
        delete contents.relationsharedAsReceiver;
        // console.log(contents);
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

    createUserMessage( priv_message : UserMessages): Observable<UserMessages>
    {
        return from(this.usermessagesRepository.save(priv_message));
    }

    createChatMessage( chan_msg : ChannelMessages): Observable<ChannelMessages>
    {
        return from(this.channelmessagesRepository.save(chan_msg));
    }
}