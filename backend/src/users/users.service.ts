import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository , UpdateResult, DeleteResult} from 'typeorm';

@Injectable()
export class UsersService {

    public findOne(login:string): User {
        let user:User = new User();
        user.nickname = login;
        user.email = login+"@"+login;
        return user;
    }
}