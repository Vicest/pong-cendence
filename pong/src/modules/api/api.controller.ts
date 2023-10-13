import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { ApiService } from './api.service';
import { User , Friend, Channels, Match, Subscription} from './orm.entity';
import { Observable } from 'rxjs';
import { UpdateResult, DeleteResult} from 'typeorm';
//, Friend, Channels, Match, Subscription

@Controller('api')
export class ApiController {

    constructor(private readonly apiService: ApiService){}

    //TODO ?IS THIS TEMPORARY?
    @Get('/leaderboard')
    getLeaderboard() : Observable<User[]>
    {
        return this.apiService.findLeaderboard();
    }

    /*          USERS           */
    // GET /users --> { ... }
    @Get('/users')
    getUsers() : Observable<User[]>
    {
        return this.apiService.findAllUsers();
    }

    // GET /users/:id --> { ... }
    @Get('/users/:id')
    getOneUsers(@Param('id') id: string) : Observable<User | null>
    {
        return this.apiService.findOneUserById(id);
    }

    // POST /users
    @Post('/users')
    createUsers(@Body() user : User ) : Observable<User>
    {
        return this.apiService.createUser(user);
    }

    // PUT /users/:id --> { ... }
    @Put('/users/:id')
    updateUsers(@Param('id') id: string ,@Body() user : User ) : Observable<UpdateResult>
    {
        return this.apiService.updateUser(id, user)
    }

    // DELETE /users/:id --> { ... }
    @Delete('/users/:id')
    deleteUsers(@Param('id') id: string )  : Observable<DeleteResult>
    {
        return this.apiService.deleteUser(id);
    }
    
    /*          FRIENDS           */
    // GET /friends
    @Get('/friends/:id')
    getFriendos(@Param('id') id: number): Observable<Friend[] | null> 
    {
        return this.apiService.getFriends(id);
    }

    // GET /friends/id_rec/id_send
    @Get('/friends/:id_rec/:id_send')
    getFriendRequest(@Param('id_rec') id_rec: number, @Param('id_send') id_send: number): Observable<Friend | null> 
    {
        return this.apiService.getFriendRequest(id_send, id_rec);
    }

    // POST /friends
    @Post('/friends')
    createFriend(@Body() fri : Friend ) : Observable<Friend>
    {
        return this.apiService.createFriend(fri);
    }
    
    /*          CHANNELS           */
    
    // GET /channel --> { ... }
    @Get('/channel')
    getChannels() : Observable<Channels[]>
    {
        return this.apiService.findAllChannels();
    }

    // GET /channel/:id --> { ... }
    @Get('/channel/:id')
    getOneChannels(@Param('id') id: number) : Observable<Channels | null>
    {
        return this.apiService.findOneChannelById(id);
    }

    // POST /channel
    @Post('/channel')
    createChannels(@Body() user : Channels ) : Observable<Channels>
    {
        return this.apiService.createChannel(user);
    }

    // PUT /channel/:id --> { ... }
    @Put('/channel/:id')
    updateChannels(@Param('id') id: number ,@Body() user : Channels ) : Observable<UpdateResult>
    {
        return this.apiService.updateChannel(id, user)
    }

    // DELETE /channel/:id --> { ... }
    @Delete('/channel/:id')
    deleteChannels(@Param('id') id: number )  : Observable<DeleteResult>
    {
        return this.apiService.deleteChannel(id);
    }

    /*          MATCHES           */

    // GET /match/:id
    @Get('/match/:id')
    getMatch(@Param('id') id: string): Observable<Match[] | null> 
    {
        return this.apiService.getMatchesfromPlayer(id);
    }

    // POST /messages
    @Post('/match')
    createMatch(@Body() match : Match ) : Observable<Match>
    {
        return this.apiService.createMatch(match);
    }

    /*          SUBSCRIPTIONS           */

    // GET /subscriptions --> { ... }
    @Get('/subscriptions')
    getSubscriptions() : Observable<Subscription[]>
    {
        return this.apiService.findAllSubscriptions();
    }
    
    // GET /subscriptions/:id_channel --> { ... }
    @Get('channel/:id_channel')
    getUsersListInChannel(@Param('id_channel') id: number) : Promise<User[] | null>
    {
        return this.apiService.findUsersInChannel(id);
    }

    // GET /subscriptions/:id_user --> { ... }
    @Get('/subscriptions/:id_user')
    getChannelListFromUser(@Param('id_user') id: number) : Promise<Channels[] | null>
    {
        return this.apiService.findChannelswithUser(id);
    }

    // POST /subscriptions
    @Post('/subscriptions')
    createSubscription(@Body() user : Subscription ) : Observable<Subscription>
    {
        return this.apiService.createSubscription(user);
    }

    // PUT /subscriptions/:id --> { ... }
    @Put('/subscriptions/:id')
    updateSubscription(@Param('id') id: number ,@Body() user : Subscription ) : Observable<UpdateResult>
    {
        return this.apiService.updateSubscription(id, user)
    }

    // DELETE /subscriptions/:id --> { ... }
    @Delete('/subscriptions/:id')
    deleteSubscription(@Param('id') id: number )  : Observable<DeleteResult>
    {
        return this.apiService.deleteSubscription(id);
    }
}
