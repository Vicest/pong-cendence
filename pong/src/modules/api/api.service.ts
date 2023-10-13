import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository , UpdateResult, DeleteResult} from 'typeorm';
import { User , Friend, Channels, Match, Subscription } from './orm.entity';
import { Observable , from } from 'rxjs';
//, Friend , Channels, Match, Subscription
@Injectable()
export class ApiService {
  


  constructor(
    @InjectRepository(User)
    private readonly UserDBRepository : Repository<User>,
    @InjectRepository(Friend)
    private readonly friendDBRepository : Repository<Friend>,
    @InjectRepository(Channels)
    private readonly channelDBRepository : Repository<Channels>,
    @InjectRepository(Match)
    private readonly matchDBRepository : Repository<Match>,
    @InjectRepository(Subscription)
    private readonly subscriptionsDBRepository : Repository<Subscription>
  )
  {}

  // LEADERBOARD
  findLeaderboard(): Observable<User[]> {
    return from(this.UserDBRepository.find({
      select: {
        Nick:true,
        Rating:true
      },
      order: {
        Rating:"DESC"
      },
      take:3
    }));
  }
  
  // USER

  createUser(user : User): Observable<User>
  {
    return from(this.UserDBRepository.save(user));
  }

  findOneUserById(id: string): Observable<User | null> {
    return from(this.UserDBRepository.findOne({ where: { Id_Token: id } }));
  }

  findAllUsers(): Observable<User[]>
  {
    return from(this.UserDBRepository.find());
  }

  updateUser(id: string, user : User): Observable<UpdateResult>
  {
    return from(this.UserDBRepository.update(id, user));
  }

  deleteUser(id: string) : Observable<DeleteResult>
  {
    return from(this.UserDBRepository.delete(id));
  }

  //FRIEND
  
  createFriend(fri : Friend): Observable<Friend>
  {
    return from(this.friendDBRepository.save(fri));
  }

  getFriendRequest(id_s : number, id_r : number) : Observable<Friend | null>
  {
    return from(this.friendDBRepository.findOne(
    { 
        where: [{ User1: id_s , User2: id_r}]
    }));
  }

  getFriends(id: number) : Observable<Friend[] | null>
  {
    return from(this.friendDBRepository.find(
        { 
          where: [{ User1: id , Accepted : true},{ User2: id , Accepted : true}]
        }));
  }
  
  //CHANNEL

  createChannel(user : Channels): Observable<Channels>
  {
    return from(this.channelDBRepository.save(user));
  }

  findOneChannelById(id: number): Observable<Channels | null> {
    return from(this.channelDBRepository.findOne({ where: { id_channel: id } }));
  }

  findAllChannels(): Observable<Channels[]>
  {
    return from(this.channelDBRepository.find());
  }

  updateChannel(id: number, channel : Channels): Observable<UpdateResult>
  {
    return from(this.channelDBRepository.update(id, channel));
  }

  deleteChannel(id: number) : Observable<DeleteResult>
  {
    return from(this.channelDBRepository.delete(id));
  }

  //MATCHES
  createMatch(match : Match): Observable<Match>
  {
    return from(this.matchDBRepository.save(match));
  }

  getMatchesfromPlayer(id_user: string) : Observable<Match[] | null>
  {
    return from(this.matchDBRepository.find(
        { 
          where: [{ user1: id_user },{ user2: id_user}],
          order: { date: 'ASC' }
        }));
  }
  
  //SUBSCRIPTIONS

  // TIENE QUE DEVOLVER UNA LISTA DE CANALES EN LOS QUE ESTE EL USUARIO X
  async findChannelswithUser(id: number): Promise<Channels[] | null> {
    const subscriptions = await this.subscriptionsDBRepository.find({ where: { id_user : id } });

    if (subscriptions.length === 0) {
        return null; // No hay suscripciones para el usuario
    }

    const channelIds = subscriptions.map((sub: { id_channel: any; }) => sub.id_channel);

    return this.channelDBRepository
        .createQueryBuilder('channel')
        .where('channel.id_channel IN (:...ids)', { ids: channelIds })
        .getMany();
  }

  // TIENE QUE DEVOLVER UNA LISTA DE USUARIOS EN EL CANAL X
  async findUsersInChannel(id: number): Promise<User[] | null> {
    const subscriptions = await this.subscriptionsDBRepository.find({ where: { id_channel : id } });

    if (subscriptions.length === 0) {
        return null; // No hay suscripciones para el usuario
    }

    const userIds = subscriptions.map((sub: { id_user: any; }) => sub.id_user);

    return this.UserDBRepository
        .createQueryBuilder('user')
        .where('user.Id_Token IN (:...ids)', { ids: userIds })
        .getMany();
  }

  createSubscription(sub : Subscription): Observable<Subscription>
  {
    return from(this.subscriptionsDBRepository.save(sub));
  }
  
  findAllSubscriptions(): Observable<Subscription[]>
  {
      return from(this.subscriptionsDBRepository.find());
  }

  updateSubscription(id: number, sub : Subscription): Observable<UpdateResult>
  {
    return from(this.subscriptionsDBRepository.update(id, sub));
  }
  
  deleteSubscription(id: number) : Observable<DeleteResult>
  {
    return from(this.subscriptionsDBRepository.delete(id));
  }
  
}
