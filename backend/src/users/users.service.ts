import { Injectable, Logger } from '@nestjs/common';
import { User } from './entities/user.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository , UpdateResult, DeleteResult} from 'typeorm';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {
        this.log = new Logger;
    }

    //TODO I suspect that create simply returns User or some sort of error.
    public async create(login:string): Promise<User|null> {
        const newUser:User|null = await this.userRepository.create({nickname:login, isRegistered:false});
        this.log.debug(`Created user ${newUser}`)
        if (newUser) await this.userRepository.save(newUser);
        return newUser;
    }

    public async findOne(login:string): Promise<User|null> {
        return this.userRepository.findOneBy({ nickname:login });
    }
    
    private log:Logger;
}