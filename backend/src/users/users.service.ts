import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository , UpdateResult, DeleteResult} from 'typeorm';
import { Observable , from } from 'rxjs';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly UserDBRepository : Repository<User>,
    ){}


async createUser(users : User): Observable<User>
{


}
