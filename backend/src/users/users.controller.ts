import { Body, Controller, Get, Param, Post, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Observable } from 'rxjs';
import { User } from './entities/user.entity';
import { UserRelation } from './entities/userRelations.entity';
import { JwtGuard } from 'src/auth/jwt.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor (private readonly userService : UsersService) {}

    // GET frase/:str --> { ... }x
    @Get('frase/:str')
    getTexto(@Param('str') str: string) : string
    {
        return "Hola "+str+"!";
    }

    // GET /:login --> { ... }
    @Get(':login')
    getOneUsers(@Param('login') login: string) : Promise<User | null>
    {
        return this.userService.findOneUserById(login);
    }

    // POST /add
    @Post('/add')
    createUsers(@Body() user : User ) : Observable<User>
    {
        return this.userService.createUser(user);
    }

    // POST /addrelation
    @Post('/addrelation')
    createRelation(@Body() data : any ) : Observable<UserRelation>
    {
        console.log("User1: ", data.user1);
        return this.userService.createRelationship(data.user1, data.user2);
    }

}

export class UsersController {
  constructor(private usersService:UsersService) {}

  @UseGuards(JwtGuard)
  @Get('/all')
  getAll() {
    let users = this.usersService.findAll();
    return users;
  }
}